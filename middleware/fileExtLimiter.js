const path = require('path');

module.exports = function(extentions) {
  return function(req, res, next) {
    if (req.files) {
      const files = req.files;
  
      try {
        const filesExtentions = [];

        Object.keys(files).forEach( key => {
          filesExtentions.push(path.extname(files[key].name));
        });

        const allowed = filesExtentions.every(ext => extentions.includes(ext));

        if(!allowed) {
          return res.status(422).json({
            message: `some files have unallowed extentions. Allowed extentions ${extentions.toString()}`
          })
        }
    
      } catch (err) {
        console.log(err);
        return res.status(403).json({ message: 'User not logged in' });
      }

    }
    next();
  }
};