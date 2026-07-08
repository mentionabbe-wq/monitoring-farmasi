# Instalasi manual Monitoring Farmasi di CasaOS

> Cara paling mudah adalah metode **online** di [README.md](README.md) (tinggal
> tempel `docker-compose.yml`, tanpa upload file). Panduan di bawah ini adalah
> metode manual — berguna kalau server CasaOS tidak boleh mengunduh image dari
> ghcr.io.

Aplikasi berjalan sebagai container Docker kecil (image resmi `node:20-alpine`,
tanpa perlu build image sendiri). Data tersimpan terpusat di server dalam satu
file `monfar-db.json`, sehingga aplikasi bisa dibuka dari banyak perangkat
(komputer/HP) dengan data yang sama.

## Cara install (lewat tampilan CasaOS, tanpa perintah terminal)

### 1. Upload file aplikasi
1. Buka CasaOS di browser, masuk ke aplikasi **Files**.
2. Masuk ke folder `/DATA/AppData`, buat folder baru: `monitoring-farmasi`.
3. Di dalamnya buat folder `app`, lalu **upload 2 file** ke sana:
   - `index.html`
   - `server.js`

   Hasil akhirnya: `/DATA/AppData/monitoring-farmasi/app/index.html` dan `.../app/server.js`

### 2. Install aplikasinya
1. Di dashboard CasaOS klik tombol **+** → **Install a customized app**.
2. Klik ikon **Import** (pojok kanan atas dialog).
3. Salin-tempel seluruh isi file `docker-compose.manual.yml`, klik **Submit**, lalu **Install**.
4. Tunggu sampai selesai (CasaOS otomatis mengunduh image `node:20-alpine`).

### 3. Buka aplikasi
- Klik ikon **Monitoring Farmasi** di dashboard, atau buka `http://IP-CASAOS:8087`
  (contoh: `http://192.168.1.10:8087`).
- Di bagian atas aplikasi harus tertulis **"● data tersimpan di server"** (hijau).
  Kalau tertulis kuning "data tersimpan di browser ini", berarti API server tidak
  terbaca — cek log container di CasaOS.
- Saat pertama dibuka, kalau di browser itu ada data lama (dari versi file HTML),
  aplikasi menawarkan untuk memindahkannya ke server. Cukup jawab **OK** sekali saja
  dari satu perangkat.

## Lokasi data & backup
- Database: `/DATA/AppData/monitoring-farmasi/data/monfar-db.json`
- Backup cukup salin file tersebut (atau pakai tombol **⬇ Backup Data** di aplikasi,
  yang mengunduh file JSON dan bisa dikembalikan lewat tombol **⬆ Restore**).

## Ganti port
Kalau port 8087 sudah terpakai, ubah baris `"8087:8080"` di file compose
(angka kiri saja, misal `"8090:8080"`) sebelum di-import, dan sesuaikan `port_map`.

## Alternatif lewat SSH (opsional)
```sh
cd /DATA/AppData/monitoring-farmasi
# letakkan index.html, server.js, docker-compose.yml di sini (compose bisa di mana saja)
docker compose up -d
```

## Update aplikasi
Cukup timpa `index.html` / `server.js` di folder `app` lewat Files, lalu restart
container **monitoring-farmasi** dari dashboard CasaOS. Data tidak akan hilang
karena tersimpan terpisah di folder `data`.

## Catatan
- Aplikasi ini untuk jaringan lokal (LAN/tailscale). Jangan diekspos langsung ke
  internet karena belum ada login/autentikasi.
- Penyimpanan bersifat "yang terakhir menyimpan yang menang" per modul — kalau dua
  orang mengedit modul yang sama persis di detik yang sama, salah satu bisa tertimpa.
  Untuk pemakaian bergantian/normal ini tidak masalah.
