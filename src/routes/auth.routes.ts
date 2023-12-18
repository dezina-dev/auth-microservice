import express from 'express';
import userController from '../controllers/auth.controller';
import { uploadMiddleware } from '../middleware/uploadMiddleware';
import multer from 'multer';
const router = express();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/new-access-token', userController.getNewAccessToken);
router.post('/upload-image', upload.single('image'), uploadMiddleware, userController.uploadImage);

export default router;