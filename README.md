# Technical Test Backend – Assist.id

## Deskripsi Umum

Repository ini berisi tiga service backend terpisah (microservices) untuk kebutuhan technical test di Assist.id:

- **company-a-service**: Manajemen data dan autentikasi karyawan Company A.
- **company-b-service**: Manajemen data dan autentikasi karyawan Company B.
- **absense-service**: Manajemen absensi dan cuti karyawan dari Company A & B.

Setiap service berjalan secara independen menggunakan Node.js, Express, MongoDB, dan dokumentasi API menggunakan Swagger.

---

## Kebutuhan/Requirement

- Node.js (versi 18.x atau lebih baru)
- npm (Node Package Manager)
- MongoDB (local/cloud, contoh: MongoDB Atlas)
- Git

---

## Langkah Konfigurasi & Menjalankan Service

1. **Clone repository ini:**

   ```powershell
   git clone https://github.com/anwarJIHAD/TechnicalTestBackendAssist.id.git
   cd TechnicalTestBackendAssist.id
   ```

2. **Install dependencies untuk setiap service:**

   ```powershell
   cd company-a-service
   npm install
   cd ../company-b-service
   npm install
   cd ../absense-service
   npm install
   ```

3. **Buat file `.env` di masing-masing folder service**  
   Contoh isi `.env`:

   ```env
   MONGO_URI=mongodb://123:123@ac-tptsjys-shard-00-00.vfdr0ej.mongodb.net:27017,ac-tptsjys-shard-00-01.vfdr0ej.mongodb.net:27017,ac-tptsjys-shard-00-02.vfdr0ej.mongodb.net:27017/?ssl=true&replicaSet=atlas-u4dd18-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=rahasia_super_secret
   PORT=3001 # (untuk companyA)
   PORT=3002 # (untuk companyB)
   PORT=3003 # (untuk Absense)

   ```

4. **Jalankan masing-masing service:**
   ```powershell
   # Di masing-masing folder service, jalankan:
   npm run dev
   # atau
   npm start
   ```

---

## Dokumentasi API (Swagger)

Setiap service menyediakan dokumentasi interaktif menggunakan Swagger. Berikut link default untuk masing-masing service:

- **Company A Service:** [http://localhost:3002/api-docs](http://localhost:3002/api-docs)
- **Company B Service:** [http://localhost:3003/api-docs](http://localhost:3003/api-docs)
- **Absense Service:** [http://localhost:3001/api-docs](http://localhost:3001/api-docs)

---

## Daftar Endpoint Utama

### Company A Service

- `POST   /api/company-a/login-karyawan` – Login karyawan
- `POST   /api/company-a/login-admin` – Login admin
- `GET    /api/company-a/employees` – List semua karyawan (auth)
- `POST   /api/company-a/employees` – Tambah karyawan baru (auth)
- `PUT    /api/company-a/edit/{nip}` – Edit data karyawan (auth)
- `DELETE /api/company-a/delete/{nip}` – Hapus karyawan (auth)

### Company B Service

- `POST   /api/company-b/login-karyawan` – Login karyawan
- `POST   /api/company-b/login-admin` – Login admin
- `GET    /api/company-b/employees` – List semua karyawan (auth)
- `POST   /api/company-b/employees` – Tambah karyawan baru (auth)
- `PUT    /api/company-b/edit/{nip}` – Edit data karyawan (auth)
- `DELETE /api/company-b/delete/{nip}` – Hapus karyawan (auth)

### Absense Service

- `GET    /api/absense/` – List absensi (auth)
- `POST   /api/absense/create-absense` – Tambah absensi (auth)
- `GET    /api/absense/laporan-absense-all/` – List absen dan cuti (auth)
- `GET    /api/absense/laporan-absense-karyawan/` – List absen dan cuti (auth) bagi karyawan yang login
- `POST   /api/absense/create-cuti` – Ajukan cuti (auth)
- `POST   /api/absense/create-sakit` – Ajukan cuti (auth)
- `POST   /api/absense/admin-ApproveCutiSakit/:id` – admin approve cuti/sakit (auth)   
- `POST   /api/absense/admin-rejectCutiSakit/:id` – admin reject cuti/sakit (auth)   

> **Catatan:** Endpoint lengkap dan detail parameter dapat dilihat di Swagger masing-masing service.

---

## Struktur Folder

```
technicalTestBackend/
│
├── company-a-service/
├── company-b-service/
├── absense-service/
└── README.md
```

---

## Catatan Tambahan

- Pastikan MongoDB sudah berjalan sebelum menjalankan service.
- Jangan upload file `.env` ke repository (sudah diatur di `.gitignore`).
- Untuk pengujian, gunakan Postman atau Swagger UI yang sudah disediakan.

---

## Kontribusi

Pull request dan issue sangat terbuka untuk perbaikan atau pengembangan lebih lanjut.

---

## Lisensi

MIT License

## HASIL DOKUMENTASI
![image](https://github.com/user-attachments/assets/21b8fed8-3663-452f-92db-ae5ccb1f4f1f)

![image](https://github.com/user-attachments/assets/169ac3bb-cda8-49a3-8916-363a9a297790)

![image](https://github.com/user-attachments/assets/1f949000-2947-4d3a-ae28-4e4438ab51cb)
