import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware.js'; 
import pool from '../config/db.js';

const router = express.Router();

router.get('/my-qr', protect, authorize(['siswa']), (req, res) => {
    res.json({ message: "Siswa QR Code data" });
});

// --- Dashboard Siswa ---
router.get('/dashboard', protect, authorize(['siswa']), async (req, res, next) => {
    try {
        const siswaId = req.user.id;

        // 1. Profil siswa
        const profileQuery = `
            SELECT s.nisn, s.nama_siswa, k.nama_kelas, k.grade
            FROM siswa s
            LEFT JOIN kelas k ON s.kelas_id = k.kelas_id
            WHERE s.siswa_id = $1
        `;
        const profileResult = await pool.query(profileQuery, [siswaId]);
        const profile = profileResult.rows[0] || {};

        // 2. Ringkasan kehadiran (seluruh tahun ajaran aktif)
        const summaryQuery = `
            SELECT 
                COUNT(*) AS total_absensi,
                SUM(CASE WHEN a.status_kehadiran = 'Hadir' THEN 1 ELSE 0 END) AS total_hadir,
                SUM(CASE WHEN a.status_kehadiran = 'Sakit' THEN 1 ELSE 0 END) AS total_sakit,
                SUM(CASE WHEN a.status_kehadiran = 'Izin' THEN 1 ELSE 0 END) AS total_izin,
                SUM(CASE WHEN a.status_kehadiran = 'Alpha' THEN 1 ELSE 0 END) AS total_alpha
            FROM absensi a
            WHERE a.siswa_id = $1
        `;
        const summaryResult = await pool.query(summaryQuery, [siswaId]);
        const summary = summaryResult.rows[0] || {};

        // 3. Riwayat 7 hari terakhir
        const recentQuery = `
            SELECT 
                a.absensi_id,
                DATE(a.waktu_masuk) AS tanggal,
                TO_CHAR(a.waktu_masuk, 'HH24:MI') AS waktu,
                a.status_kehadiran,
                a.keterangan
            FROM absensi a
            WHERE a.siswa_id = $1
            ORDER BY a.waktu_masuk DESC
            LIMIT 7
        `;
        const recentResult = await pool.query(recentQuery, [siswaId]);

        // 4. Status absensi hari ini
        const today = new Date().toISOString().slice(0, 10);
        const todayQuery = `
            SELECT a.status_kehadiran, TO_CHAR(a.waktu_masuk, 'HH24:MI') AS waktu
            FROM absensi a
            WHERE a.siswa_id = $1 AND DATE(a.waktu_masuk) = $2
            LIMIT 1
        `;
        const todayResult = await pool.query(todayQuery, [siswaId, today]);

        const totalAbsensi = parseInt(summary.total_absensi) || 0;
        const totalHadir = parseInt(summary.total_hadir) || 0;
        const persentaseHadir = totalAbsensi > 0 ? Math.round((totalHadir / totalAbsensi) * 100) : 0;

        res.status(200).json({
            profile: {
                nama_siswa: profile.nama_siswa || '-',
                nisn: profile.nisn || '-',
                nama_kelas: profile.nama_kelas || '-',
                grade: profile.grade || '-',
            },
            summary: {
                total_absensi: totalAbsensi,
                total_hadir: totalHadir,
                total_sakit: parseInt(summary.total_sakit) || 0,
                total_izin: parseInt(summary.total_izin) || 0,
                total_alpha: parseInt(summary.total_alpha) || 0,
                persentase_hadir: persentaseHadir,
            },
            today: todayResult.rows[0] || null,
            recent: recentResult.rows,
        });

    } catch (error) {
        console.error("Error getSiswaDashboard:", error);
        next(error);
    }
});

export default router;