-- Denna SQL-fil körs automatiskt första gången MariaDB startar och skapar databasen.
-- Här kan du lägga starttabeller och testdata inför Moment 5 & 6.

CREATE TABLE IF NOT EXISTS besokare (
    id INT AUTO_INCREMENT PRIMARY KEY,
    namn VARCHAR(100) NOT NULL,
    meddelande TEXT,
    skapad_tid TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exempeldata för att snabbt kunna testa SQL-frågor
INSERT INTO besokare (namn, meddelande) VALUES
('ByHe', 'Välkommen till Webbserverprogrammering 1!'),
('Node.js & Express', 'Servern och MariaDB är anslutna och redo.');
