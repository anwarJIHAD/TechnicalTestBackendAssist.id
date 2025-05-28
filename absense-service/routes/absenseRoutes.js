const express = require('express');
const router = express.Router();
const controller = require('../controllers/absenseController');
const authMiddleware = require('../middleware/authMiddleware');
const authAdmin = require('../middleware/authAdmin');
// const validateUser = require('../utils/validateUser');

/**
 * @swagger
 * /api/absense/create-absense:
 *   post:
 *     summary: Create a new absense record
 *     tags: [Karyawan A/B]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-05-25T08:00:00+07:00"
 *     responses:
 *       201:
 *         description: Absense successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 nip:
 *                   type: string
 *                 source:
 *                   type: string
 *                   example: "companyA"
 *                 username:
 *                   type: string
 *                 status:
 *                   type: string
 *                   example: "absent"
 *                 date:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: "User not found in either company"
 *       403:
 *         description: "Forbidden: Invalid token"
 *       500:
 *         description: "Internal server error"
 */

router.post('/create-absense', authMiddleware, controller.createAbsense);

/**
 * @swagger
 * /api/absense/create-cuti:
 *   post:
 *     summary: Create a new cuti (leave) record
 *     tags: [Karyawan A/B]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-05-25T08:00:00+07:00"
 *     responses:
 *       201:
 *         description: Cuti successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 nip:
 *                   type: string
 *                 source:
 *                   type: string
 *                 status:
 *                   type: string
 *                   example: "cuti"
 *                 approval:
 *                   type: string
 *                   example: "pending"
 *                 date:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: "User not found in either company / Sudah mengajukan cuti di hari ini"
 *       403:
 *         description: "Forbidden: Invalid token"
 *       500:
 *         description: "Internal server error"
 */
router.post('/create-cuti', authMiddleware, controller.createCuti);

/**
 * @swagger
 * /api/absense/create-sakit:
 *   post:
 *     summary: Create a new sakit (sick leave) record
 *     tags: [Karyawan A/B]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-05-25T08:00:00+07:00"
 *     responses:
 *       201:
 *         description: Sakit successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 nip:
 *                   type: string
 *                 source:
 *                   type: string
 *                 status:
 *                   type: string
 *                   example: "sakit"
 *                 approval:
 *                   type: string
 *                   example: "pending"
 *                 date:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: "User not found in either company / Sudah mengajukan sakit di hari ini"
 *       403:
 *         description: "Forbidden: Invalid token"
 *       500:
 *         description: "Internal server error"
 */
router.post('/create-sakit', authMiddleware, controller.createSakit);

/**
 * @swagger
 * /api/absense:
 *   get:
 *     summary: Mendapatkan seluruh data absense
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Daftar absense berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   nip:
 *                     type: string
 *                   source:
 *                     type: string
 *                   status:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Internal server error
 */
router.get('/', authAdmin, controller.getAllAbsenses);

/**
 * @swagger
 * /api/absense/admin-ApproveCutiSakit/{id}:
 *   put:
 *     summary: Approve pengajuan cuti atau sakit berdasarkan ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID dari pengajuan cuti atau sakit
 *     responses:
 *       200:
 *         description: Pengajuan berhasil di-approve
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cuti approved"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     nip:
 *                       type: string
 *                     source:
 *                       type: string
 *                     status:
 *                       type: string
 *                       example: "cuti"
 *                     approval:
 *                       type: string
 *                       example: "approved"
 *                     date:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Pengajuan tidak ditemukan
 *       500:
 *         description: Internal server error
 */
router.put('/admin-ApproveCutiSakit/:id', authAdmin, controller.approveCuti);

/**
 * @swagger
 * /api/absense/admin-rejectCutiSakit/{id}:
 *   put:
 *     summary: Reject pengajuan cuti atau sakit berdasarkan ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID dari pengajuan cuti atau sakit
 *     responses:
 *       200:
 *         description: Pengajuan berhasil di-reject
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cuti/Sakit rejected"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     nip:
 *                       type: string
 *                     source:
 *                       type: string
 *                     status:
 *                       type: string
 *                       example: "cuti"
 *                     approval:
 *                       type: string
 *                       example: "rejected"
 *                     date:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Pengajuan tidak ditemukan
 *       500:
 *         description: Internal server error
 */
router.put('/admin-rejectCutiSakit/:id', authAdmin, controller.rejectCuti);

/**
 * @swagger
 * /api/absense/laporan-absense-all:
 *   post:
 *     summary: Laporan absensi pegawai dalam rentang tanggal tertentu
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-01"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-31"
 *     responses:
 *       200:
 *         description: Laporan absensi berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 laporan:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       nip:
 *                         type: string
 *                         example: "123456"
 *                       jumlah_telat:
 *                         type: integer
 *                         example: 2
 *                       jumlah_tidak_masuk:
 *                         type: integer
 *                         example: 1
 *                       jumlah_cuti:
 *                         type: integer
 *                         example: 1
 *             example:
 *               laporan:
 *                 - nip: "123456"
 *                   jumlah_telat: 2
 *                   jumlah_tidak_masuk: 1
 *                   jumlah_cuti: 1
 *                 - nip: "654321"
 *                   jumlah_telat: 0
 *                   jumlah_tidak_masuk: 0
 *                   jumlah_cuti: 2
 *       400:
 *         description: startDate dan endDate wajib diisi
 *       500:
 *         description: Internal server error
 */
router.post('/laporan-absense-all/', authAdmin, controller.laporanAbsense);

/**
 * @swagger
 * /api/absense/laporan-absense-karyawan:
 *   post:
 *     summary: Laporan absensi pegawai dalam rentang tanggal tertentu
 *     tags: [Karyawan A/B]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-01"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-31"
 *     responses:
 *       200:
 *         description: Laporan absensi berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 laporan:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       nip:
 *                         type: string
 *                         example: "123456"
 *                       jumlah_telat:
 *                         type: integer
 *                         example: 2
 *                       jumlah_tidak_masuk:
 *                         type: integer
 *                         example: 1
 *                       jumlah_cuti:
 *                         type: integer
 *                         example: 1
 *             example:
 *               laporan:
 *                 - nip: "123456"
 *                   jumlah_telat: 2
 *                   jumlah_tidak_masuk: 1
 *                   jumlah_cuti: 1
 *                 - nip: "654321"
 *                   jumlah_telat: 0
 *                   jumlah_tidak_masuk: 0
 *                   jumlah_cuti: 2
 *       400:
 *         description: startDate dan endDate wajib diisi
 *       500:
 *         description: Internal server error
 */
router.post('/laporan-absense-karyawan/', authMiddleware, controller.laporanAbsenseKaryawan);

module.exports = router;
