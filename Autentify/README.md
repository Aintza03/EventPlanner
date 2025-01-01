# Autentify
Sistema de autenticación para la gestión de eventos

## Hay que tener instalado
* Python
* MySQL
## Instalar las dependencias
Para instalar las dependencias hay que ejecutar:

    cd EventPlanner/Auntentify
    pip install -r requirements.txt
    
## Iniciar el microservicio

**Nota:** Los cuatro microservicios requieren tener la base de datos de MySQL creada por lo que hay que ejecutar (en workbench por ejemplo) db/setup.sql.

Para ejecutar el microservicio hay que:

    uvicorn main:app --host 0.0.0.0 --port 8000

**Nota:** Si se quiere ejecutar el microservicio sin docker hay que ir a main.py y en la linea 11 cambiar docker.host.internal por localhost.
