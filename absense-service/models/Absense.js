const mongoose = require('mongoose');

const absenseSchema = new mongoose.Schema({
  nip: { type: String, required: true, unique: true },
  source: { type: String, required: true },// 'company1' or 'company2'
  status: { type: String, required: true }, // 'absent', 'sick', 'leave', etc.
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Absense', absenseSchema);
