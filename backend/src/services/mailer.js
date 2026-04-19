import nodemailer from 'nodemailer';

let transporter = null;

export function getTransporter() {
  if (transporter) return transporter;

  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (!user || !pass) {
    console.warn('Email credentials not configured (EMAIL_USER / EMAIL_PASS). Reminders disabled.');
    return null;
  }

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
  return transporter;
}

export async function sendReminderEmail({ to, task }) {
  const t = getTransporter();
  if (!t) throw new Error('Mailer not configured');

  const fromName = process.env.EMAIL_FROM_NAME || 'DeadlineHub';
  const deadlineStr = new Date(task.deadline).toLocaleString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  const subject = `⏰ Reminder: "${task.title}" is due soon`;
  const text = `Hi,

This is a reminder that your task "${task.title}" is due on ${deadlineStr}.

${task.description ? `Description: ${task.description}\n\n` : ''}Source: ${task.source}
Priority: ${task.priority}
${task.link ? `Link: ${task.link}\n` : ''}
— ${fromName}`;

  const html = `
    <div style="font-family: -apple-system, Segoe UI, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #333;">
      <h2 style="color: #4e73df; margin-bottom: 8px;">⏰ Deadline Reminder</h2>
      <p style="color: #666; margin-top: 0;">Your task is coming up soon.</p>
      <div style="background: #f8f9fc; border-left: 4px solid #4e73df; padding: 16px 20px; border-radius: 6px; margin: 20px 0;">
        <h3 style="margin: 0 0 8px 0; color: #333;">${escapeHtml(task.title)}</h3>
        ${task.description ? `<p style="margin: 8px 0; color: #555;">${escapeHtml(task.description)}</p>` : ''}
        <p style="margin: 12px 0 4px 0;"><strong>Due:</strong> ${deadlineStr}</p>
        <p style="margin: 4px 0;"><strong>Source:</strong> ${escapeHtml(task.source)}</p>
        <p style="margin: 4px 0;"><strong>Priority:</strong> ${escapeHtml(task.priority)}</p>
        ${task.link ? `<p style="margin: 8px 0 0 0;"><a href="${escapeHtml(task.link)}" style="color: #4e73df;">Open link →</a></p>` : ''}
      </div>
      <p style="color: #999; font-size: 0.85rem;">Sent automatically by ${escapeHtml(fromName)}.</p>
    </div>
  `;

  return t.sendMail({
    from: `"${fromName}" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  });
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
