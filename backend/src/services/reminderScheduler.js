import cron from 'node-cron';
import Task from '../models/Task.js';
import User from '../models/User.js';
import { sendReminderEmail, getTransporter } from './mailer.js';

async function checkAndSendReminders() {
  const now = new Date();

  const users = await User.find({
    emailReminders: true,
    reminderEmail: { $ne: '' },
  });

  if (users.length === 0) return;

  for (const user of users) {
    const leadMs = (user.reminderLeadMinutes || 60) * 60 * 1000;
    const cutoff = new Date(now.getTime() + leadMs);

    const dueTasks = await Task.find({
      user: user._id,
      completed: false,
      reminderSent: false,
      deadline: { $lte: cutoff, $gte: now },
    });

    for (const task of dueTasks) {
      try {
        await sendReminderEmail({ to: user.reminderEmail, task });
        task.reminderSent = true;
        await task.save();
        console.log(`Sent reminder to ${user.reminderEmail} for task "${task.title}"`);
      } catch (err) {
        console.error(`Failed to send reminder for "${task.title}":`, err.message);
      }
    }
  }
}

export function startReminderScheduler() {
  if (!getTransporter()) {
    console.log('Reminder scheduler not started (no mail transport configured)');
    return;
  }
  cron.schedule('* * * * *', () => {
    checkAndSendReminders().catch((err) =>
      console.error('Reminder scheduler error:', err.message)
    );
  });
  console.log('Reminder scheduler started (runs every minute)');
}
