// services/validateUser.js

const CompanyAUser = require('../models/CompanyAUser');
const CompanyBUser = require('../models/CompanyBUser');

const validateUser = async (nip) => {
  try {
    const userA = await CompanyAUser.findOne({ nip });
    if (userA) {
      return { valid: true, source: 'companyA', user: userA };
    }

    const userB = await CompanyBUser.findOne({ nip });
    if (userB) {
      return { valid: true, source: 'companyB', user: userB };
    }

    return { valid: false };
  } catch (err) {
    console.error('Validation error:', err);
    return { valid: false };
  }
};

module.exports = validateUser;
