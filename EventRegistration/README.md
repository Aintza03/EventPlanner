# EventRegistration
Sistema de gestión de eventos de la aplicación
## Hay que tener instalado
* Python
* MySQL
## Instalar las dependencias
Para instalar las dependencias hay que ejecutar:

    cd EventPlanner/EventRegistration
    pip install -r requirements.txt
    
## Iniciar el microservicio

**Nota:** Los cuatro microservicios requieren tener la base de datos de MySQL creada por lo que hay que ejecutar (en workbench por ejemplo) db/setup.sql.

Para ejecutar el microservicio hay que ejecutar dentro del microservicio:
    
    uvicorn main:app --host 0.0.0.0 --port 4000

**Nota:** Si se quiere ejecutar el microservicio sin docker hay que ir a main.py y en la linea 13 cambiar docker.host.internal por localhost.
