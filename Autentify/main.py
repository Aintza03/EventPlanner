from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel

#Para base de datos
URL_BASE_DE_DATOS = 'mysql://usuarioEvento:contrasena@host.docker.internal/Eventos'
TOKEN = 'HS256'
JWT_SECRET_KEY = 'd0a0c1fd67fa5fca2c42e19692575f7c2f1299cc7cf0f0b378e85406d369dbcb'

DataBase = declarative_base()
engine = create_engine(URL_BASE_DE_DATOS)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
contexto_pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app = FastAPI()
#Crea la entidad usuario que tiene id autoincremental, nombre de usuario, contraseña y gmail
class Usuario(DataBase):
    __tablename__ = 'usuario'
    id = Column(Integer, primary_key=True)
    nombreUsuario = Column(String(100), unique=True, nullable=False)
    contrasena = Column(String(200), nullable=False)
    correo = Column(String(100), unique=True, nullable=False)

#Se asegura de que antes de solicitar nada esten creadas las tablas necesarias, es decir usuarios
DataBase.metadata.create_all(bind=engine)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
class UsuarioCreate(BaseModel):
    nombreUsuario: str
    contrasena: str
    correo: str
#Para registrarse en la aplicacion
@app.post('/autentificacion/register')
def register(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    #genero todos los campos salvo id que se autogenera
    print('Se utiliza la funcion /autentificacion/register.')
    hash = contexto_pwd.hash(usuario.contrasena)
    nuevoUsuario = Usuario(nombreUsuario=usuario.nombreUsuario, contrasena=hash, correo=usuario.correo)
    print('Se intenta guardar el usuario en la base de datos.')
    try:
        db.add(nuevoUsuario)
        db.commit()
        db.refresh(nuevoUsuario)
        print('Usuario guardado en la base de datos.')
        return {'mensaje': 'Usuario guardado en la base de datos'}
    except Exception as e:
        db.rollback()
        print('Ha habido un error al registrar usuarios.')
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El nombre de usuario o el correo ya existen")

class UsuarioLogin(BaseModel):
    nombreUsuario: str
    contrasena: str
#Para logearse en la aplicacion se requiere la entrada de usuario y contraseña
@app.post('/autentificacion/login')
def login(data: UsuarioLogin, db: Session = Depends(get_db)):
    print('Se utiliza la funcion /autentificacion/login.')
    print('Se busca usuario en la base de datos')
    usuario = db.query(Usuario).filter(Usuario.nombreUsuario == data.nombreUsuario).first()
    if not usuario or not contexto_pwd.verify(data.contrasena,usuario.contrasena):
        print('Usuario o contraseña incorrectos.')
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail = "La contraseña o el usuario son incorrectos")
    token = jwt.encode({"usuario": usuario.nombreUsuario}, JWT_SECRET_KEY, algorithm=TOKEN)
    print('Usuario logeado.')
    return {'token': token}

class UsuarioModify(BaseModel):
    contrasenaVieja: str = None
    contrasenaNueva: str = None
    contrasenaRepetida: str = None
    correo: str = None
#Para modificar los datos de un usuario. Puedes modificar el gmail o la contraseña. En el caso de la contraseña necesitas añadir la contraseña antigua y repetir la nueva dos veces.
@app.put('/autentificacion/modify')
def modify_user(data: UsuarioModify, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    print('Se utiliza la funcion /autentificacion/modify.')
    print('Comprobando autentificacion')
    try:
        token_modificar = jwt.decode(token, JWT_SECRET_KEY, algorithms=[TOKEN])
        nombreUsuario = token_modificar.get("usuario")
        if nombreUsuario is None:
            print('No se ha especificado un usuario')
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="No se ha podido identificar al usuario")
    except JWTError:
        print('El usuario especificado no esta logeado')
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="No se ha podido identificar al usuario")
    print('Usuario permitido')
    usuario = db.query(Usuario).filter(Usuario.nombreUsuario== nombreUsuario).first()
    print('Buscando usuario en la base de datos')
    if not usuario:
        print('Usuario no encontrado')
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    if data.contrasenaNueva:
        if data.contrasenaVieja and not contexto_pwd.verify(data.contrasenaVieja, usuario.contrasena): 
            print('Contrasena antigua no coincide')
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="La contraseña vieja no es valida")
        elif data.contrasenaNueva != data.contrasenaRepetida:
            print('Contrasena nueva no coincide con la contrasena repetida')
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="La contrasena no coincide")
        else:
            print('Contrasena cambiada')
            usuario.contrasena = contexto_pwd.hash(data.contrasenaNueva)
    if data.correo:
        print('Correo cambiado')
        usuario.correo = data.correo
    print('Guardando cambios')
    try:
        db.commit()
        print('Cambios guardados')
        return {'mensaje': 'Cambios guardados'}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error al guardar los cambios")

#Para obtener datos del usuario
@app.get('/autentificacion/user')
def get_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    print('Se utiliza la funcion /autentificacion/user.')
    print('Comprobando autentificacion')
    try:
        tokenObtenido = jwt.decode(token, JWT_SECRET_KEY, algorithms=[TOKEN])
        nombreUsuario = tokenObtenido.get("usuario")
        if nombreUsuario is None:
            print('No se ha especificado un usuario')
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="No se ha podido identificar al usuario")
    except JWTError:
        print('El usuario especificado no esta logeado')
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="No se ha podido identificar al usuario")
    print('Usuario permitido')
    usuario = db.query(Usuario).filter(Usuario.nombreUsuario == nombreUsuario).first()
    print('Buscando usuario en la base de datos')
    if not usuario:
        print('Usuario no encontrado')
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    print('Usuario encontrado. Se devuelve al cliente')
    return {'idUsuario': usuario.id, 'nombreUsuario': usuario.nombreUsuario, 'correo': usuario.correo}

#Para obtener un usuario por su gmail
@app.get('/autentificacion/usuarioCorreo/{correo}')
def get_user_by_email(correo: str, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    print('Se utiliza la funcion /autentificacion/usuarioCorreo.')
    print('Comprobando autentificacion')
    try:
        tokenObtenido = jwt.decode(token, JWT_SECRET_KEY, algorithms=[TOKEN])
        nombreUsuario = tokenObtenido.get("usuario")
        if nombreUsuario is None:
            print('No se ha especificado un usuario')
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="No se ha podido identificar al usuario")
    except JWTError:
        print('El usuario especificado no esta logeado')
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="No se ha podido identificar al usuario")
    print('Usuario permitido')
    usuario = db.query(Usuario).filter(Usuario.correo == correo).first()
    print('Buscando usuario en la base de datos')
    if not usuario:
        print('Usuario no encontrado')
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    print('Usuario encontrado. Se devuelve al cliente')
    return {'idUsuario': usuario.id, 'nombreUsuario': usuario.nombreUsuario, 'correo': usuario.correo}

#obtener usuario por id
@app.get('/autentificacion/usuarioId/{idUsuario}')
def get_user_by_id(idUsuario: int, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    print('Se utiliza la funcion /autentificacion/usuarioId.')
    print('Comprobando autentificacion')
    try:
        tokenObtenido = jwt.decode(token, JWT_SECRET_KEY, algorithms=[TOKEN])
        nombreUsuario = tokenObtenido.get("usuario")
        if nombreUsuario is None:
            print('No se ha especificado un usuario')
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="No se ha podido identificar al usuario")
    except JWTError:
        print('El usuario especificado no esta logeado')
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="No se ha podido identificar al usuario")
    print('Usuario permitido')
    usuario = db.query(Usuario).filter(Usuario.id == idUsuario).first()
    print('Buscando usuario en la base de datos')
    if not usuario:
        print('Usuario no encontrado')
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    print('Usuario encontrado. Se devuelve al cliente')
    return {'idUsuario': usuario.id, 'nombreUsuario': usuario.nombreUsuario, 'correo': usuario.correo}