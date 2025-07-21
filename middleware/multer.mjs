import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'client/assets/uploads/avatars'),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (!['.png', '.jpg', '.jpeg'].includes(ext.toLowerCase())) {
      return cb(new Error('Only images are allowed'), false);
    }
    cb(null, true);
  }
});

export default upload;
