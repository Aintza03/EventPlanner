Create database if not exists Eventos;
CREATE USER if not exists 'usuarioEvento'@'localhost' IDENTIFIED BY 'contrasena';
GRANT ALL PRIVILEGES ON Eventos.* TO 'usuarioEvento'@'localhost';
FLUSH PRIVILEGES;
