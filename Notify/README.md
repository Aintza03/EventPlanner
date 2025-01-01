# Notify
Sistema de notificaciones para la gestión de eventos

## Hay que tener instalado
* Node.js
* MongoDB
* MySQL
## Instalar las dependencias
Para instalar las dependencias hay que ejecutar:

    cd EventPlanner/Auntentify
    npm install

## Iniciar el proyecto

**Nota:** Los cuatro microservicios requieren tener la base de datos de MySQL creada por lo que hay que ejecutar (en workbench por ejemplo) db/setup.sql.

Primero, hay que abrir una terminal y ejecutar((solo hay que preparar la base de datos una vez cada vez que se levanta el proyecto)):
  
    mongod --dbpath C:\EventPlanner\db\eventUpdateDB

Donde pone C:\EventPlanner\db\eventUpdateDB hay sustituir C:\ Por el directorio correcto.

Y para ejecutar el microservicio (no se podra ejecutar nada mas en esta terminal):
  
    npm run start

**Nota:** Debido a que la aplicacion esta pensada para trabajar con docker.compose, si no quiere hacerse asi hay que acceder a app.module.ts y donde pone host.docker.internal cambiar a localhost.
