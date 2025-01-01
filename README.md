# EventPlanner
Sistema de gestión de eventos. 

***Link a la presentación:*** https://docs.google.com/presentation/d/1Ev9CS_V8EwNwqvTZ2EQya9UUwxZBlfk0HxygX7djCdE/edit?usp=sharing

## Hay que tener instalado

* MongoDB
* MySQL
* Python
* Node.js
* Docker
* Docker Compose

## Dependencias que hay que instalar
- Python:

      cd EventPlanner/Auntentify
      pip install -r requirements.txt
      cd EventPlanner/EventRegistration
      pip install -r requirements.txt
  
- Node:

      cd EventPlanner/EventUpdate
      npm install
      cd EventPlanner/Notify
      npm install
  
## Iniciar el servidor

**Nota:** En caso de ser la primera vez que se ejecuta la aplicación antes de nada abra que ejecutar db/setup.sql en MySQLWorkbench o similar para crear la base de datos sql. 

Para ejecutar el proyecto completo con docker hay que abrir una ventana del terminal y ejecutar:

    mongod --dbpath C:\EventPlanner\db\eventUpdateDB

Donde pone C:\EventPlanner\db\eventUpdateDB hay sustituir C:\ Por el directorio correcto.

Después hay que construir el proyecto. En otra pestaña de la terminal desde ..\EventPlanner hay que ejecutar:
    
    docker-compose build

Para finalizar se debe levantar el servidor con:

    docker-compose up

## Acceder a la parte cliente

Hay 2 partes de cliente:
* UI Programática: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
* GUI: [http://localhost:3000/html/login.html](http://localhost:3000/html/login.html)
