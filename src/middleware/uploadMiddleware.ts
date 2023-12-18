import { Request, Response, NextFunction } from 'express';
import { cloudinary } from '../utils/cloudinary.config';

const uploadMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file provided' });
        }

        const result = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`, {
            resource_type: 'auto', // Adjust based on the file type
        });

        req.body.imageUrl = result.secure_url;

        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error uploading file to Cloudinary' });
    }
};

export { uploadMiddleware };
