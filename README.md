# Docker-miljö: Node.js, Express, EJS & MariaDB

En enkel, ren och modern utvecklingsmiljö anpassad för kursen **Webbserverprogrammering 1**.

Denna miljö ersätter den tidigare LEMP-miljön (PHP/Nginx) och ger eleverna ren JavaScript hela vägen från backend till frontend, samtidigt som den välbekanta strukturen med webbserver, databas och phpMyAdmin behålls.

---

## 📦 Vad ingår i miljön?

| Tjänst | Adress i webbläsaren | Beskrivning |
| :--- | :--- | :--- |
| **Node.js & Express** | `http://localhost` (port 80) | Backend-server som kör din JavaScript-kod och renderar EJS-sidor. |
| **phpMyAdmin** | `http://localhost:8080` | Grafiskt webbgränssnitt för att skapa och hantera databaser och tabeller. |
| **MariaDB** | `db:3306` (internt) | Relationsdatabas för lagring av data. |

---

## 🚀 Snabbstart för elever

1. **Starta miljön:**
   Öppna terminalen i projektmappen och kör:
   ```bash
   docker compose up -d
   ```
   *(Första gången installeras nödvändiga npm-paket automatiskt i containern via `npm install`)*

2. **Besök webbplatsen:**
   Öppna [http://localhost](http://localhost) i din webbläsare. Du möts av testsidan som visar att Node.js körs och att MariaDB är ansluten som `root`.

3. **Hantera databasen med phpMyAdmin:**
   Öppna [http://localhost:8080](http://localhost:8080) i din webbläsare.
   * **Användarnamn:** `root`
   * **Lösenord:** `12345`
   * **Server:** `db`

4. **Stoppa miljön när du är klar för dagen:**
   ```bash
   docker compose down
   ```

---

## 📁 Mappstruktur

```text
├── docker-compose.yml   # Definierar containrarna (Node, MariaDB, phpMyAdmin)
├── .env                 # Inställningar, portar och databaslösenord
├── db/
│   └── init.sql         # SQL-skript som körs automatiskt vid första databasstarten
└── www/
    ├── package.json     # Node-beroenden (Express, EJS, mysql2, nodemon)
    ├── nodemon.json     # Konfiguration för automatisk omstart vid sparande
    ├── server.js        # Webbserverns huvudfil och rutter
    ├── public/          # Statiska filer (CSS, bilder, klient-JS)
    │   ├── css/style.css
    │   └── js/main.js
    └── views/           # EJS-mallar (ersätter era gamla .php-sidor)
        └── index.ejs
```

### Vad ska ligga var?
* **`www/server.js`:** Här skriver du din backend-logik, skapar rutter (`app.get`, `app.post`) och hanterar databasfrågor.
* **`www/views/`:** Här sparar du dina `.ejs`-filer. De renderas på servern med `res.render('sidnamn', data)` och skickas som färdig HTML till användaren.
* **`www/public/`:** Filer som webbläsaren kan hämta direkt, t.ex. stilmallar (`/css/style.css`), bilder (`/bilder/logo.png`) och skript (`/js/main.js`).

---

## ⚡ Automatisk omstart (Hot-reload)

Servern körs med **Nodemon**. Så fort du sparar en fil (`server.js` eller i `views/`) startar servern om automatiskt. Du behöver bara uppdatera sidan i webbläsaren (`F5` eller `Ctrl+R` / `Cmd+R`).

* **Se serverns loggar i realtid:**
  ```bash
  docker compose logs -f web
  ```
  *(Tryck `Ctrl+C` för att avsluta loggläsaren)*

---

## 💡 Snabbguide: Från PHP till EJS

EJS är valt för att syntaxen är mycket lik den klassiska PHP-syntaxen:

| Funktion | PHP | EJS |
| :--- | :--- | :--- |
| **Skriv ut variabel** | `<?= $namn ?>` | `<%= namn %>` |
| **Villkor** | `<?php if ($inloggad) { ?>` | `<% if (inloggad) { %>` |
| **Loop** | `<?php foreach ($rader as $r): ?>` | `<% rader.forEach(r => { %>` |
| **Avsluta block** | `<?php } ?>` | `<% } %>` |
| **Inkludera header** | `<?php include 'header.php'; ?>` | `<%- include('partials/header') %>` |

---

## 🗄️ Exempel: Hämta data från MariaDB

I `server.js` finns redan en anslutningspool (`pool`). Så här enkelt hämtar du rader i en rutt:

```javascript
app.get('/besokare', async (req, res) => {
  try {
    const [rader] = await pool.query('SELECT * FROM besokare');
    res.render('besokare', { besokare: rader });
  } catch (err) {
    res.status(500).send('Databasfel: ' + err.message);
  }
});
```

I `views/besokare.ejs`:
```html
<h1>Besökslista</h1>
<ul>
  <% besokare.forEach(b => { %>
    <li><strong><%= b.namn %>:</strong> <%= b.meddelande %></li>
  <% }); %>
</ul>
```

---

## 🛠️ Felsökning & vanliga frågor

* **Logga in i databasen:**
  Använd alltid `root` som användare och `12345` som lösenord.

* **Port 80 eller 8080 är upptagen på min dator:**
  Öppna filen `.env` och ändra:
  ```env
  PORT=3000
  PMA_PORT=8081
  ```
  Då når du webbservern på `http://localhost:3000` och phpMyAdmin på `http://localhost:8081`.

* **Nollställa databasen från grunden:**
  Om du vill återställa databasen och köra `db/init.sql` på nytt:
  ```bash
  docker compose down -v
  docker compose up -d
  ```
  *Flaggan `-v` raderar den gamla databasvolymen så att en helt ren skapas.*
