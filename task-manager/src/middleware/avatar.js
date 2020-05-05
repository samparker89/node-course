const multer = require('multer');

const mult = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Invalid file type. Must be a valid image format'));
    }

    return cb(undefined, true);
  },
});

const avatar = mult.single('avatar');

module.exports = avatar;
