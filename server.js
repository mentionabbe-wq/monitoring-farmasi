// Server Monitoring Farmasi — Node murni tanpa dependensi (untuk CasaOS/Docker)
// Menyajikan index.html + API penyimpanan data terpusat di satu file JSON.
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = parseInt(process.env.PORT || '8080', 10);
const DATA_DIR = process.env.DATA_DIR || '/data';
const DB_FILE = path.join(DATA_DIR, 'monfar-db.json');

function bacaDB(){
  try { return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); }
  catch (e) { return {}; }
}

function tulisDB(db){
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const tmp = DB_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(db));
  fs.renameSync(tmp, DB_FILE); // tulis-lalu-rename agar file tidak korup kalau mati listrik
}

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');

  // GET /api/data -> seluruh data { kunci: [baris,...] }
  if (req.method === 'GET' && url.pathname === '/api/data') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(bacaDB()));
    return;
  }

  // PUT /api/data/<kunci> -> simpan satu kunci (body = array JSON)
  const m = url.pathname.match(/^\/api\/data\/([a-z_]{1,50})$/);
  if (req.method === 'PUT' && m) {
    let body = '';
    req.on('data', c => {
      body += c;
      if (body.length > 20 * 1024 * 1024) req.destroy(); // batas 20 MB
    });
    req.on('end', () => {
      try {
        const nilai = JSON.parse(body);
        if (!Array.isArray(nilai)) throw new Error('harus array');
        const db = bacaDB();
        db[m[1]] = nilai;
        tulisDB(db);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end('{"ok":true}');
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: e.message }));
      }
    });
    return;
  }

  // Halaman aplikasi
  if (req.method === 'GET' && (url.pathname === '/' || url.pathname === '/index.html')) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    fs.createReadStream(path.join(__dirname, 'index.html')).pipe(res);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
}).listen(PORT, () => {
  console.log('Monitoring Farmasi berjalan di port ' + PORT + ', data di ' + DB_FILE);
});
