const jwt = require('jsonwebtoken');
const { jwtKey } = require('../config');

module.exports = function(req, res, next) {
  if (req.methods === "OPTIONS") {
    next();
  }

  try {
    const token = req.headers.authorization.split(' ')[1];

    if(!token) {
      return res.status(403).json({ message: 'User is not logged in' });
    }

    const decodedData = jwt.verify(token, jwtKey);
    req.user = decodedData;
    next();

  } catch (err) {
    console.log(err);
    return res.status(403).json({ message: 'User not logged in' });
  }
};