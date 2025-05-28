const mongoose = require('mongoose');

const absenseSchema = new mongoose.Schema({
  nip: { type: String, required: true, unique: true },
  source: { type: String, required: true },// 'company1' or 'company2'
  status: { type: String, required: true }, // 'cuti', 'izin', 'leave', etc.
  approval: { type: String, required: true,default:'pending' }, // 'pending', 'approved', 'reject', etc.
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Cuti', absenseSchema);
