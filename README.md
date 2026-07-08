# MedTrack Pro — Sistem Rekam Medis & Farmasi Terpadu

Aplikasi input dan monitoring farmasi rumah sakit:

1. **Form Antibiotik** — dengan penanda otomatis form yang belum dikumpulkan lebih dari 3 hari
2. **Monitoring Pengisian E-RM**
3. **Monitoring Pengisian RM Status Manual** (CPPO, rekonsiliasi obat, edukasi)
4. **Screening Harian**
5. **Monitoring Obat High Alert (PKPO)** — kategori obat (elektrolit konsentrat, LASA/NORUM, dll), pelabelan stiker, penyimpanan, double check 2 petugas
6. **Laporan Jaga IBS** — jenis operasi, cek floor stok, pemakaian floorstock, input paket obat, resep narkotik, SDM double check (tiap seksi multi-baris, tersimpan per tanggal)

Fitur: pencarian, edit/hapus, export Excel (.xlsx) per modul, laporan IBS satu workbook
berisi 7 sheet, cetak laporan, backup/restore JSON.

## Install di CasaOS (online, paling mudah)

1. Dashboard CasaOS → **+** → **Install a customized app** → klik ikon **Import**
   (pojok kanan atas).
2. Salin-tempel seluruh isi [docker-compose.yml](docker-compose.yml) → **Submit** → **Install**.
3. Buka `http://IP-CASAOS:8087` — pastikan header menampilkan
   **"● data tersimpan di server"** (hijau).

CasaOS otomatis mengunduh image `ghcr.io/mentionabbe-wq/monitoring-farmasi:latest`
yang di-build oleh GitHub Actions setiap kali ada perubahan di repo ini.

## Install manual (tanpa internet / tanpa registry)

Ikuti [README-CASAOS.md](README-CASAOS.md) — upload `index.html` + `server.js` lewat
aplikasi Files lalu import [docker-compose.manual.yml](docker-compose.manual.yml).

## Pemakaian tanpa server

`index.html` juga bisa dibuka langsung di browser (double-click). Pada mode ini data
tersimpan di localStorage browser tersebut (indikator kuning "data tersimpan di
browser ini") dan tidak dibagikan antar perangkat.

## Arsitektur

- **Frontend**: `index.html` — satu file, vanilla JS, tanpa dependensi.
- **Backend**: `server.js` — Node murni tanpa dependensi; API `GET /api/data` dan
  `PUT /api/data/<modul>`; data di `/data/monfar-db.json` (ditulis atomik).
- **Update**: push ke branch `main` → GitHub Actions build image multi-arch
  (amd64 + arm64) → di CasaOS tinggal klik update/recreate container.

## Catatan keamanan

Belum ada login/autentikasi — jalankan hanya di jaringan lokal (LAN) rumah sakit,
jangan diekspos langsung ke internet.
