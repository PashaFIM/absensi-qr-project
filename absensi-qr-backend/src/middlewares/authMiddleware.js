import asyncHandler from 'express-async-handler'; 
import jwt from 'jsonwebtoken';
import * as UserModel from '../models/userModel.js';
import pool from '../config/db.js';

export const protect = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await UserModel.findUserById(decoded.id);
            
            if (!user) {
                res.status(401);
                throw new Error('Otorisasi gagal, pengguna tidak ditemukan di database.');
            }
            req.user = {
                id: user.user_id, 
                username: user.username,
                role: user.role
            };

            // Enrich user data with nama_siswa and nama_kelas for siswa role
            if (user.role === 'siswa') {
                const siswaQuery = `
                    SELECT s.nama_siswa, s.nisn, k.nama_kelas
                    FROM siswa s
                    LEFT JOIN kelas k ON s.kelas_id = k.kelas_id
                    WHERE s.siswa_id = $1
                `;
                const siswaResult = await pool.query(siswaQuery, [user.user_id]);
                if (siswaResult.rows.length > 0) {
                    req.user.nama_siswa = siswaResult.rows[0].nama_siswa;
                    req.user.nisn = siswaResult.rows[0].nisn;
                    req.user.nama_kelas = siswaResult.rows[0].nama_kelas;
                }
            }
            
            next();

        } catch (error) {
            console.error('Token tidak valid:', error.message);
            res.status(401);
            throw new Error('Otorisasi gagal, token tidak valid atau kadaluwarsa.');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Tidak ada token, otorisasi ditolak.');
    }
});

export const authorize = (roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            res.status(401);
            throw new Error('Pengguna tidak terautentikasi.');
        }
        
        if (roles.includes(req.user.role)) {
            next(); 
        } else {
            res.status(403); 
            throw new Error('Anda tidak memiliki izin untuk mengakses rute ini.');
        }
    };
};
