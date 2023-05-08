const jwt = require('jsonwebtoken');
const { jwtKey } = require('../config');

module.exports = function(roles) {
  return function(req, res, next) {
    if (req.methods === "OPTIONS") {
      next();
    }
  
    try {
      const token = req.headers.authorization.split(' ')[1];
  
      if(!token) {
        return res.status(403).json({ message: 'User is not logged in' });
      }
  
      const { user } = jwt.verify(token, jwtKey);

      if(!roles.includes(user.role.name)) {
        return res.status(403).json({ message: 'Access denied' });
      }

      next();
  
    } catch (err) {
      console.log(err);
      return res.status(403).json({ message: 'User not logged in' });
    }
  }
};