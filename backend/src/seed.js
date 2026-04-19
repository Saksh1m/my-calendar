import User from './models/User.js';

const DEFAULT_USERNAME = 'saksham';
const DEFAULT_EMAIL = 'saksham@deadlinehub.local';
const DEFAULT_PASSWORD = 'jimjam';

export default async function seedDefaults() {
  let user = await User.findOne({ email: DEFAULT_EMAIL });
  if (!user) {
    user = await User.create({
      name: DEFAULT_USERNAME,
      email: DEFAULT_EMAIL,
      password: DEFAULT_PASSWORD,
    });
    console.log(`Seeded default user: ${DEFAULT_USERNAME} / ${DEFAULT_PASSWORD}`);
  }

}
