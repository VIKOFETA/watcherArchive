module.exports = function(size) {
  return function(req, res, next) {
    if (req.files) {
      const files = req.files;
      const FILE_SIZE_LIMIT = size * 1024 * 1024;
  
      try {
        const bigFiles = []

        Object.keys(files).forEach( key => {
          if (files[key].size > FILE_SIZE_LIMIT) {
            bigFiles.push(files[key].name);
          }
        });

        if(bigFiles.length) {
          return res.status(413).json({message: "Some file are over limit", files: bigFiles})
        }
    
      } catch (err) {
        console.log(err);
        return res.status(403).json({ message: 'User not logged in' });
      }

    }
    next();
  }
};