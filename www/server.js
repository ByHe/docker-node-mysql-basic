import express from 'express';
import path from 'path';

const app = express();
const PORT = 3000;

// Ställ in EJS som mallmotor (view engine)
app.set('view engine', 'ejs');
app.set('views', path.join(import.meta.dirname, 'views'));

// Gör mappen 'public' tillgänglig för statiska filer (CSS, klient-JS, bilder)
app.use(express.static(path.join(import.meta.dirname, 'public')));

// Gör så att Express kan tolka inskickad formulärdata (POST req.body) och JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Startsidan
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Node.js & EJS - Webbserverprogrammering 1',
    nodeVersion: process.version
  });
});

// Starta servern
app.listen(PORT, () => {
  console.log(`Webbservern är igång och lyssnar på port ${PORT}`);
  console.log(`Öppna http://localhost i din webbläsare`);
});
