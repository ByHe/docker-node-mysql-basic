const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Ställ in EJS som mallmotor (view engine)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Gör mappen 'public' tillgänglig för statiska filer (CSS, klient-JS, bilder)
app.use(express.static(path.join(__dirname, 'public')));

// Gör så att Express kan tolka inskickad formulärdata (POST req.body) och JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Skapa en anslutningspool till MariaDB/MySQL som root
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '12345',
  database: process.env.DB_NAME || 'webbserver_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Startsidan (motsvarar gamla index.php i Moment 0)
app.get('/', async (req, res) => {
  let dbStatus = { ok: false, message: 'Ansluter...' };

  try {
    // Kontrollera databasanslutningen med en enkel SQL-fråga
    const [rows] = await pool.query('SELECT VERSION() AS version, DATABASE() AS currentDb');
    dbStatus = {
      ok: true,
      version: rows[0].version,
      currentDb: rows[0].currentDb,
      user: process.env.DB_USER || 'root',
      host: process.env.DB_HOST || 'db'
    };
  } catch (error) {
    dbStatus = {
      ok: false,
      message: error.message
    };
  }

  // Rendera EJS-mallen views/index.ejs och skicka med data
  res.render('index', {
    title: 'Node.js & EJS - Webbserverprogrammering 1',
    nodeVersion: process.version,
    dbStatus
  });
});

// Starta servern
app.listen(PORT, () => {
  console.log(`Webbservern är igång och lyssnar på port ${PORT}`);
  console.log(`Öppna http://localhost i din webbläsare`);
});
