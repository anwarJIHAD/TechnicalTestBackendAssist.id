require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedUsers = [
  {
    nip: 'B001',
    nama: 'Admin B',
    username: 'admin',
    password: '12345',
    email: 'admin@companyb.com',
    jabatan: 'admin',
    noHp: '081234567892',
  },
  {
    nip: 'B002',
    nama: 'Karyawan B',
    username: 'karyawanB',
    password: '54321',
    email: 'karyawan@companyb.com',
    jabatan: 'karyawan',
    noHp: '081234567893',
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
    console.log('Seeder selesai untuk Company B!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
