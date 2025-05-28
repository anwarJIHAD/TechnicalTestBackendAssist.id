const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: Token missing' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    if (req.user.jabatan === 'admin') {
      next(); // Lanjut ke route
    } else {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }
  } catch (err) {
    return res.status(403).json({ message: 'Forbidden: Invalid token' });
  }
};
