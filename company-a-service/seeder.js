require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedUsers = [
  {
    nip: 'A001',
    nama: 'Admin A',
    username: 'admin',
    password: '12345',
    email: 'admin@companya.com',
    jabatan: 'admin',
    noHp: '081234567890',
  },
  {
    nip: 'A002',
    nama: 'Karyawan A',
    username: 'karyawanA',
    password: '54321',
    email: 'karyawan@companya.com',
    jabatan: 'karyawan',
    noHp: '081234567891',
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    for (const userData of seedUsers) {
      const exists = await User.findOne({
        $or: [{ username: userData.username }, { nip: userData.nip }],
      });
      if (!exists) {
        await User.create(userData);
        console.log(`User default '${userData.username}' berhasil diinsert.`);
      } else {
        console.log(
          `User default '${userData.username}' sudah ada, skip insert.`
        );
      }
    }
    console.log('Seeder selesai untuk Company A!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
