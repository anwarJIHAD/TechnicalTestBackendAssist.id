const karyawanA = require('../models/User');
const jwt = require('jsonwebtoken');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await karyawanA.find();
    const totalKaryawan = users.length;
    res.json({ Data: users, 'jumlah karyawan A': totalKaryawan });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { nip, username } = req.body;
    const existsNip = await karyawanA.findOne({ nip });
    console.log('NIP:', existsNip); // Tambahkan ini untuk debugging
    const existsUsername = await karyawanA.findOne({ username });
    if (existsNip)
      return res.status(400).json({ message: 'nip already existing' });
    if (existsUsername)
      return res.status(400).json({ message: 'username already existing' });
    const user = new karyawanA(req.body);
    await user.save();
    res
      .status(201)
      // .json({ status: 'berhasil masukkan data Perusahaan A', Data: user });
      .json({ message: 'berhasil menambahkan data karyawanA', data: user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await karyawanA.findOne({ username });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'username / password salah' });
    if (user.jabatan != 'admin')
      return res
        .status(401)
        .json({ message: 'anda tidak memiliki akses ke admin' });
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.role,
        nip: user.nip,
        statusUser: 'karyawanA',
        jabatan: user.jabatan,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );
    const payload = {
      id: user._id,
      username: user.username,
      email: user.role,
      nip: user.nip,
      statusUser: 'karyawanA',
      jabatan: user.jabatan,
    };
    res.json({ token, payload });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await karyawanA.findOne({ username });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'username / password salah' });

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.role,
        nip: user.nip,
        statusUser: 'karyawanA',
        jabatan: user.jabatan,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );
    const payload = {
      id: user._id,
      username: user.username,
      email: user.role,
      nip: user.nip,
      statusUser: 'karyawanA',
      jabatan: user.jabatan,
    };
    res.json({ token, payload });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.editUser = async (req, res) => {
  try {
    const { nip } = req.params; // ID dari URL
    console.log('NIP:', nip);
    // Validasi apakah NIP ada di body
    const updateData = { ...req.body };

    // Jika password disertakan, hash ulang
    if (updateData.password) {
      const bcrypt = require('bcryptjs');
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await karyawanA.findOneAndUpdate(
      { nip: nip },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Karyawan tidak ditemukan' });
    }

    res.json({ message: 'UserA updated successfully', data: updatedUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { nip } = req.params;

    const deletedUser = await karyawanA.findOneAndDelete({ nip });

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
