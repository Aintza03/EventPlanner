import re
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy import Column, Integer, String, or_, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from typing import Optional

#Para base de datos
URL_BASE_DE_DATOS = 'mysql://usuarioEvento:contrasena@host.docker.internal/Eventos'
TOKEN = 'HS256'
JWT_SECRET_KEY = 'd0a0c1fd67fa5fca2c42e19692575f7c2f1299cc7cf0f0b378e85406d369dbcb'

DataBase = declarative_base()
engine = create_engine(URL_BASE_DE_DATOS)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app=FastAPI()

class Usuario(DataBase):
    __tablename__ = 'usuario'
    id = Column(Integer, primary_key=True)
    nombreUsuario = Column(String(100), unique=True, nullable=False)
    contrasena = Column(String(100), nullable=False)
    correo = Column(String(100), unique=True, nullable=False)

class Evento(DataBase):
    __tablename__ = 'evento'
    id = Column(Integer, primary_key=True)
    nombre = Column(String(100), nullable=False)
    fechaini = Column(String(100), nullable=False)
    fechafin = Column(String(100), nullable=False)
    lugar = Column(String(100), nullable=False)
    descripcion = Column(String(100), nullable=False)
    idUsuario = Column(Integer, nullable=False)
    ultModificacion = Column(String(100))
class Favorito(DataBase):
    __tablename__ = 'favorito'
    id = Column(Integer, primary_key=True)
    idUsuario = Column(Integer, nullable=False)
    idEvento = Column(Integer, nullable=False)
class Atiende(DataBase):
    __tablename__ = 'atiende'
    id = Column(Integer, primary_key=True)
    idUsuario = Column(Integer, nullable=False)
    idEvento = Column(Integer, nullable=False)
    status = Column(String(100), default='Pending')

DataBase.metadata.create_all(bind=engine)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class UsuariosEventoCreate(BaseModel):
    idUsuario: int
    nombreUsuario: str
    correo: str

    class Config:
        from_attributes = True

class EventoCreate(BaseModel):
    nombre: str
    fechaini: str
    fechafin: str
    lugar: str
    descripcion: str
    idUsuario: int
    participantes: list[UsuariosEventoCreate]
    
    class Config:
        arbitrary_types_allowed = True

class EventoRespuesta(BaseModel):
    id: int
    nombre: str
    fechaini: str
    fechafin: str
    lugar: str
    descripcion: str
    idUsuario: int

    class Config:
        from_attributes = True
        arbitrary_types_allowed = True

class EventosRespuesta(BaseModel):
    eventos: list[EventoRespuesta]

    class Config:
        from_attributes = True
        arbitrary_types_allowed = True
class InvitadoPydantic(BaseModel):
    id: int
    nombreUsuario: str
    correo: str
    class Config:
        from_attributes = True
        arbitrary_types_allowed = True
class Invitados(BaseModel):
    invitados: list[InvitadoPydantic]
    class Config:
        from_attributes = True
        arbitrary_types_allowed = True

class InvitacionRespuesta(BaseModel):
    #evento + status
    id: int
    nombre: str
    fechaini: str
    fechafin: str
    lugar: str
    descripcion: str
    status: Optional[str] = None

    class Config:
        from_attributes = True
        arbitrary_types_allowed = True

class InvitacionesRespuesta(BaseModel):
    invitaciones: list[InvitacionRespuesta]

    class Config:
        from_attributes = True
        arbitrary_types_allowed = True
#Crea los distintos eventos y los guarda en BD
@app.post('/eventos/registrar')
def creacion_de_evento(data: EventoCreate,db:Session = Depends(get_db), token = Depends(oauth2_scheme)):
    try:
        token_modificar = jwt.decode(token, JWT_SECRET_KEY, algorithms=[TOKEN])
        nombreUsuario = token_modificar.get("usuario")
        if nombreUsuario is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="No se ha podido identificar al usuario")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="No se ha podido identificar al usuario")
    
    nuevoEvento = Evento(nombre=data.nombre,fechaini=data.fechaini,fechafin=data.fechafin,lugar=data.lugar,descripcion=data.descripcion,idUsuario=data.idUsuario)
    try:
        db.add(nuevoEvento)
        db.commit()
        db.refresh(nuevoEvento)
        for participante in data.participantes:
            atiende = Atiende(idUsuario=participante.idUsuario,idEvento=nuevoEvento.id)
            db.add(atiende)
            db.commit()
            db.refresh(atiende)
        return {'mensaje':'Evento ' + nuevoEvento.nombre + ' guardado en la base de datos'}
    except Exception as e:
        db.rollback()
        #send error
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail='Error al guardar el evento en la base de datos' + str(e))

#Obtiene todos los eventos creados por el usuario
@app.get('/eventos/{id}',response_model=EventosRespuesta)
def obtener_eventos(id:int,db: Session = Depends(get_db)):
    eventos = db.query(Evento).filter(Evento.idUsuario == id).all()
    if not eventos:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail='No hay eventos')
    return EventosRespuesta(eventos=eventos)

#Obtiene un evento en especifico
@app.get('/evento/{id}', response_model=EventoRespuesta)
def obtener_evento(id:int,db: Session = Depends(get_db)):
    evento = db.query(Evento).filter(Evento.id == id).first()
    if not evento:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail='Evento no encontrado')
    return evento

#obtiene la lista de invitados a un evento
@app.get('/evento/invitados/{id}', response_model=Invitados)
def obtener_invitados(id:int, db: Session = Depends(get_db)):
    invitados = db.query(Usuario).join(Atiende,Usuario.id == Atiende.idUsuario).filter(Atiende.idEvento == id).all()
    return Invitados(invitados=invitados)

#Obtiene aquellos eventos a los que estoy invitado
@app.get('/eventos/invitados/{id}',response_model=InvitacionesRespuesta)
def obtener_eventos_atiende(id: int, db: Session = Depends(get_db)):
    eventos = db.query(Evento).join(Atiende, Evento.id == Atiende.idEvento).filter(Atiende.idUsuario == id).all()
    invitaciones = []
    for ev in eventos:
        atiende = db.query(Atiende).filter(Atiende.idUsuario == id).filter(Atiende.idEvento == ev.id).first()
        if atiende:
            invitacion = InvitacionRespuesta(
                id=ev.id,
                nombre=ev.nombre,
                fechaini=ev.fechaini,
                fechafin=ev.fechafin,
                lugar=ev.lugar,
                descripcion=ev.descripcion,
                status=atiende.status
            )
            invitaciones.append(invitacion)
    if not invitaciones:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='No hay eventos')
    
    return InvitacionesRespuesta(invitaciones=invitaciones)

#Obtiene aquellos eventos que tengo en favoritos
@app.get('/eventos/favoritos/{id}', response_model=EventosRespuesta)
def obtener_eventos_favoritos(id:int, db: Session = Depends(get_db)):
    eventos = db.query(Evento).join(Favorito,Evento.id == Favorito.idEvento).filter(Favorito.idUsuario == id).all()
    if not eventos:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail='No hay eventos favoritos')
    return EventosRespuesta(eventos=eventos)

#Elimina un evento de la base de datos
@app.post('/eventos/eliminar/{id}')
def eliminar_evento(id:int, db: Session = Depends(get_db)):
    evento = db.query(Evento).filter(Evento.id == id).first()
    if not evento:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail='Evento no encontrado')
    try:
        db.delete(evento)
        db.commit()
        return {'mensaje':'Evento eliminado de la base de datos'}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail='Error al eliminar el evento')

#Pasa el estatus de un evento de favorito a normal
@app.post('/eventos/favoritos/eliminar/{idUsuario}/{idEvento}')
def eliminarFavorito(idUsuario:int,idEvento:int, db: Session = Depends(get_db)):
    favorito = db.query(Favorito).filter(Favorito.idUsuario == idUsuario).filter(Favorito.idEvento == idEvento).first()
    if not favorito:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail='Este evento no esta en favoritos')
    try:
        db.delete(favorito)
        db.commit()
        return {'mensaje':'Evento eliminado de favoritos'}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail='Error al cambiar el estado del evento')

#Pasa el estatus de un evento de normal a favorito
@app.post('/eventos/favoritos/agregar/{idUsuario}/{idEvento}')
def agregarFavorito(idUsuario:int,idEvento:int, db: Session = Depends(get_db)):
    favorito = Favorito(idUsuario=idUsuario,idEvento=idEvento)
    try:
        db.add(favorito)
        db.commit()
        db.refresh(favorito)
        return {'mensaje':'Evento agregado a favoritos'}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail='Error al cambiar el estado del evento')

#Funcion de busqueda especificas la pestaña el usuario y el texto de busqueda
@app.get('/buscar/Eventos/{pestana}/{id}/{texto}', response_model=InvitacionesRespuesta)
def buscar_eventos(pestana:str, id:int, texto:str, db:Session = Depends(get_db)):
    if re.match(r'\d{4}/\d{2}/\d{2}( \d{2}:\d{2})?',texto):
        #obtiene cualquier evento que ocurra durante esta fecha
        eventos = db.query(Evento).filter(or_(Evento.fechaini <= texto, Evento.fechafin >= texto)).all()
    else:
        eventos = db.query(Evento).filter(or_(Evento.nombre.contains(texto),Evento.lugar.contains(texto),Evento.descripcion.contains(texto))).all()
    if not eventos:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail='No se han encontrado eventos.')
    else:
        if pestana == 'MisEventos':
            #eliminar eventos que no son mios
            eventos = [ev for ev in eventos if ev.idUsuario == id]
            return InvitacionesRespuesta(invitaciones=eventos)
        elif pestana == 'Invitaciones':
            eventos = [ev for ev in eventos if db.query(Atiende).filter(Atiende.idUsuario == id).filter(Atiende.idEvento == ev.id).first() != None]
            invitaciones = []
            for ev in eventos:
                atiende = db.query(Atiende).filter(Atiende.idUsuario == id).filter(Atiende.idEvento == ev.id).first()
                if atiende:
                    invitacion = InvitacionRespuesta(
                        id=ev.id,
                        nombre=ev.nombre,
                        fechaini=ev.fechaini,
                        fechafin=ev.fechafin,
                        lugar=ev.lugar,
                        descripcion=ev.descripcion,
                        status=atiende.status
                    )
                    invitaciones.append(invitacion)
                    return InvitacionesRespuesta(invitaciones=invitaciones)
        else:
            eventos = [ev for ev in eventos if db.query(Favorito).filter(Favorito.idUsuario == id).filter(Favorito.idEvento == ev.id).first() != None]
            return InvitacionesRespuesta(invitaciones=eventos)