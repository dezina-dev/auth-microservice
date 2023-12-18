const jwt = require('jsonwebtoken');
import User from '../models/User.model';

const verifyRefreshToken = (refreshToken: any) => {
    const privateKey = process.env.REFRESH_SECRET_KEY!;
    return new Promise(async (resolve, reject) => {
        const user = await User.findOne({ refreshToken: refreshToken })

        if (!user) {
            return reject({ error: true, message: 'Invalid refresh token' });
        }
        jwt.verify(refreshToken, privateKey, (err: any, tokenDetails: any) => {
            if (err) {
                return reject({ error: true, message: 'Invalid refresh token' });
            }
            resolve({
                user: user,
                tokenDetails,
                success: true,
                message: 'Valid refresh token',
            });
        });
    });
};

module.exports = verifyRefreshToken;
