import multer from 'multer';
import type { Request, Response, NextFunction } from 'express';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed.'));
    }
    cb(null, true);
  },
});

export const uploadPhoto = (req: Request, res: Response, next: NextFunction) => {
  upload.single('photo')(req, res, (err: unknown) => {
    if (err instanceof multer.MulterError || err instanceof Error) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};
