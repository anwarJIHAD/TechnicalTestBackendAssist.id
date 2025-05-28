const Absense = require('../models/Absense');
const validateUser = require('../services/userService');
const Cuti = require('../models/Cuti');
const CompanyAUser = require('../models/CompanyAUser');
const CompanyBUser = require('../models/CompanyBUser');

exports.createAbsense = async (req, res) => {
  const nip = req.user.nip;
  const { date } = req.body;
  console.log('NIP from user:', nip);
  console.log('dates from user:', date);
  const result = await validateUser(nip);

  if (!result.valid) {
    return res
      .status(400)
      .json({ message: 'User not found in either company' });
  }

  // Cek apakah sudah pernah absensi di hari yang sama
  const dateObj = new Date(date);
  const startOfDay = new Date(dateObj.setHours(0, 0, 0, 0));
  const endOfDay = new Date(dateObj.setHours(23, 59, 59, 999));
  const existingAbsense = await Absense.findOne({
    nip: nip,
    date: { $gte: startOfDay, $lte: endOfDay },
  });
  if (existingAbsense) {
    return res
      .status(400)
      .json({ message: 'Anda sudah melakukan absensi hari ini' });
  }

  // Tentukan status berdasarkan jam pada date
  const hour = new Date(date).getHours();
  let status = 'hadir';
  if (hour >= 8) {
    status = 'late';
  }

  const absense = new Absense({
    nip: nip,
    source: result.source,
    date: date,
    status: status,
  });

  try {
    await absense.save();
    res
      .status(201)
      .json({ message: 'data absense berhasil ditambahkan', data: absense });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createCuti = async (req, res) => {
  const nip = req.user.nip;
  const { date } = req.body;
  console.log('NIP from user:', nip);
  console.log('dates from user:', date);
  const result = await validateUser(nip);

  if (!result.valid) {
    return res
      .status(400)
      .json({ message: 'User not found in either company' });
  }

  // Cek apakah sudah pernah mengajukan cuti di hari yang sama
  const dateObj = new Date(date);
  const startOfDay = new Date(dateObj.setHours(0, 0, 0, 0));
  const endOfDay = new Date(dateObj.setHours(23, 59, 59, 999));
  const existingCuti = await Cuti.findOne({
    nip: nip,
    date: { $gte: startOfDay, $lte: endOfDay },
    status: 'cuti',
  });
  if (existingCuti) {
    return res
      .status(400)
      .json({ message: 'Anda sudah mengajukan cuti/sakit di hari ini' });
  }

  const cuti = new Cuti({
    nip: nip,
    source: result.source,
    status: 'cuti',
    approval: 'pending',
    date: date,
  });

  try {
    await cuti.save();
    res.status(201).json({
      message: 'anda berhasil mengajukan cuti dengan status pending',
      data: cuti,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createSakit = async (req, res) => {
  const nip = req.user.nip;
  const { date } = req.body;
  console.log('NIP from user:', nip);
  console.log('dates from user:', date);
  const result = await validateUser(nip);

  if (!result.valid) {
    return res
      .status(400)
      .json({ message: 'User not found in either company' });
  }

  // Cek apakah sudah pernah mengajukan sakit di hari yang sama
  const dateObj = new Date(date);
  const startOfDay = new Date(dateObj.setHours(0, 0, 0, 0));
  const endOfDay = new Date(dateObj.setHours(23, 59, 59, 999));
  const existingSakit = await Cuti.findOne({
    nip: nip,
    date: { $gte: startOfDay, $lte: endOfDay },
    status: 'sakit',
  });
  if (existingSakit) {
    return res
      .status(400)
      .json({ message: 'Anda sudah mengajukan sakit di hari ini' });
  }

  const sakit = new Cuti({
    nip: nip,
    source: result.source,
    status: 'sakit',
    approval: 'pending',
    date: date,
  });

  try {
    await sakit.save();
    res.status(201).json({
      message: 'Anda berhasil mengajukan sakit dengan status pending',
      data: sakit,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.approveCuti = async (req, res) => {
  const { id } = req.params;
  console.log('ID from request body:', id);
  try {
    const cuti = await Cuti.findById(id);
    if (!cuti) {
      return res.status(404).json({ message: 'Cuti not found' });
    }
    cuti.approval = 'approved';
    await cuti.save();
    res.status(200).json({ message: 'Cuti approved', data: cuti });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.rejectCuti = async (req, res) => {
  const { id } = req.params;
  try {
    const cuti = await Cuti.findById(id);
    if (!cuti) {
      return res.status(404).json({ message: 'Cuti/Sakit not found' });
    }
    cuti.approval = 'rejected';
    await cuti.save();
    res.status(200).json({ message: 'Cuti/Sakit rejected', data: cuti });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllAbsenses = async (req, res) => {
  try {
    const absense = await Absense.find().sort({ date: -1 });
    const cuti = await Cuti.find().sort({ date: -1 });

    // Pisahkan data cuti dan sakit
    const dataCuti = cuti.filter((item) => item.status === 'cuti');
    const dataSakit = cuti.filter((item) => item.status === 'sakit');

    res.json({ data_absen: absense, dataCuti, dataSakit });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.laporanAbsense = async (req, res) => {
  const { startDate, endDate } = req.body;
  if (!startDate || !endDate) {
    return res.status(400).json({
      message: 'startDate dan endDate wajib diisi (format: YYYY-MM-DD)',
    });
  }

  try {
    // Generate semua tanggal dalam rentang
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dates = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d).toISOString().slice(0, 10));
    }

    // Ambil semua user
    const usersA = (await CompanyAUser.find()).filter(
      (u) => u.username.toLowerCase() !== 'admin'
    );
    const usersB = (await CompanyBUser.find()).filter(
      (u) => u.username.toLowerCase() !== 'admin'
    );
    const allUsers = [...usersA, ...usersB];

    // Ambil data absensi dan cuti/sakit dalam rentang tanggal
    const absenses = await Absense.find({
      date: { $gte: start, $lte: end },
    });
    const cutis = await Cuti.find({
      date: { $gte: start, $lte: end },
    });

    // Buat laporan per pegawai, kelompokkan berdasarkan source
    const laporanA = [];
    const laporanB = [];

    allUsers.forEach((user) => {
      const nip = user.nip;
      const nama = user.nama;
      const source = usersA.find((u) => u.nip === nip)
        ? 'companyA'
        : 'companyB';

      // Data absensi dan cuti/sakit pegawai ini
      const pegawaiAbsense = absenses.filter((a) => a.nip === nip);
      const pegawaiCuti = cutis.filter(
        (c) => c.nip === nip && c.status == 'cuti'
      );
      const pegawaiSakit = cutis.filter(
        (c) => c.nip === nip && c.status == 'sakit'
      );

      // Hitung jumlah hadir dan telat
      const jumlah_hadir = pegawaiAbsense.filter(
        (a) => a.status === 'hadir'
      ).length;
      const jumlah_telat = pegawaiAbsense.filter(
        (a) => a.status === 'late'
      ).length;

      // Hitung jumlah cuti/sakit
      const jumlah_cuti = pegawaiCuti.length;
      const jumlah_sakit = pegawaiSakit.length;

      // Hitung jumlah tidak masuk (tanggal tanpa absensi/cuti/sakit)
      const tanggalAdaRecord = [
        ...pegawaiAbsense.map((a) =>
          new Date(a.date).toISOString().slice(0, 10)
        ),
        ...pegawaiCuti.map((c) => new Date(c.date).toISOString().slice(0, 10)),
        ...pegawaiSakit.map((c) => new Date(c.date).toISOString().slice(0, 10)),
      ];
      const tanggalTidakMasuk = dates.filter(
        (tgl) => !tanggalAdaRecord.includes(tgl)
      );
      const jumlah_tidak_masuk = tanggalTidakMasuk.length;

      const laporanItem = {
        nip,
        nama,
        source,
        jumlah_hadir,
        jumlah_telat,
        jumlah_tidak_masuk,
        jumlah_cuti,
        jumlah_sakit,
      };

      if (source === 'companyA') {
        laporanA.push(laporanItem);
      } else {
        laporanB.push(laporanItem);
      }
    });

    res.json({ companyA: laporanA, companyB: laporanB });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.laporanAbsenseKaryawan = async (req, res) => {
  const { startDate, endDate } = req.body;
  const nipUser = req.user.nip;
  if (!startDate || !endDate) {
    return res.status(400).json({
      message: 'startDate dan endDate wajib diisi (format: YYYY-MM-DD)',
    });
  }

  try {
    // Generate semua tanggal dalam rentang
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dates = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d).toISOString().slice(0, 10));
    }

    // Ambil semua user
    const usersA = await CompanyAUser.find({ nip: nipUser });
    const usersB = await CompanyBUser.find({ nip: nipUser });
    const allUsers = [...usersA, ...usersB];

    // Ambil data absensi dan cuti/sakit dalam rentang tanggal
    const absenses = await Absense.find({
      date: { $gte: start, $lte: end },
      nip: nipUser,
    });
    const cutis = await Cuti.find({
      date: { $gte: start, $lte: end },
      nip: nipUser,
    });

    // Buat laporan per pegawai
    const laporan = allUsers.map((user) => {
      const nip = user.nip;
      const nama = user.nama;
      const source = usersA.find((u) => u.nip === nip)
        ? 'companyA'
        : 'companyB';

      // Data absensi dan cuti/sakit pegawai ini
      const pegawaiAbsense = absenses.filter((a) => a.nip === nip);
      const pegawaiCuti = cutis.filter(
        (c) => c.nip === nip && c.status == 'cuti'
      );
      const pegawaiSakit = cutis.filter(
        (c) => c.nip === nip && c.status == 'sakit'
      );

      // Hitung jumlah telat
      const jumlah_telat = pegawaiAbsense.filter(
        (a) => a.status === 'late'
      ).length;
      const jumlah_hadir = pegawaiAbsense.filter(
        (a) => a.status === 'hadir'
      ).length;

      // Hitung jumlah cuti/sakit
      const jumlah_cuti = pegawaiCuti.length;
      const jumlah_sakit = pegawaiSakit.length;

      // Hitung jumlah tidak masuk (tanggal tanpa absensi/cuti/sakit)
      const tanggalAdaRecord = [
        ...pegawaiAbsense.map((a) =>
          new Date(a.date).toISOString().slice(0, 10)
        ),
        ...pegawaiCuti.map((c) => new Date(c.date).toISOString().slice(0, 10)),
      ];
      const tanggalTidakMasuk = dates.filter(
        (tgl) => !tanggalAdaRecord.includes(tgl)
      );
      const jumlah_tidak_masuk = tanggalTidakMasuk.length;

      return {
        nip,
        nama,
        source,
        jumlah_hadir,
        jumlah_telat,
        jumlah_tidak_masuk,
        jumlah_cuti,
        jumlah_sakit,
      };
    });

    res.json({ laporan });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
