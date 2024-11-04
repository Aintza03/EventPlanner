from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
#Para base de datos
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://usuarioEvento:contrasena@localhost/Eventos'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
#Para mandar datos entre microservicio y gateway de forma segura
app.config['JWT_SECRET_KEY'] = 'd0a0c1fd67fa5fca2c42e19692575f7c2f1299cc7cf0f0b378e85406d369dbcb'

db = SQLAlchemy(app)
jwt = JWTManager(app)
#Crea la entidad usuario que tiene id autoincremental, nombre de usuario, contraseña y gmail
class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombreUsuario = db.Column(db.String(100), unique=True, nullable=False)
    contrasena = db.Column(db.String(100), nullable=False)
    correo = db.Column(db.String(100), unique=True, nullable=False)

#Se asegura de que antes de solicitar nada esten creadas las tablas necesarias, es decir usuarios
@app.before_first_request
def create_tables():
    #Crea todas las tablas, pero si ya existen no las vuelve a crear
    db.create_all()

#Para registrarse en la aplicacion
@app.route('/autentificacion/register', methods=['POST'])
def register():
    data = request.get_json()
    #genero todos los campos salvo id que se autogenera
    hash = generate_password_hash(data['contrasena'], method='sha256')
    nuevoUsuario = Usuario(nombreUsuario=data['nombreUsuario'], contrasena=hash, correo=data['correo'])
    db.session.add(nuevoUsuario)
    db.session.commit()
    return jsonify({'mensaje': 'Usuario guardado en la base de datos'}), 200

#Para logearse en la aplicacion se requiere la entrada de usuario y contraseña
@app.route('/autentificacion/login', methods=['POST'])
def login():
    data = request.get_json()
    usuario = Usuario.query.filter_by(nombreUsuario=data['nombreUsuario']).first()
    if not usuario or not check_password_hash(usuario.contrasena, data['contrasena']):
        return jsonify({'mensaje': 'La contraseña o el usuario son incorrectos'}), 401
    token = create_access_token(identity={'username': usuario.nombreUsuario})
    return jsonify({'token': token}), 200

#Para modificar los datos de un usuario. Puedes modificar el gmail o la contraseña. En el caso de la contraseña necesitas añadir la contraseña antigua y repetir la nueva dos veces.
@app.route('/autentificacion/modify', methods=['PUT'])
@jwt_required()
def modify_user():
    data = request.get_json()
    usuarioAutentificado = get_jwt_identity()
    usuario = Usuario.query.filter_by(nombreUsuario=usuarioAutentificado['nombreUsuario']).first()
    if 'contrasenaNueva' in data:
        if 'contrasenaVieja' in data and check_password_hash(usuario.contrasena, data['contrasenaVieja']) == False: 
            return jsonify({'mensaje': 'La contraseña antigua es incorrecta'}), 401
        elif 'contrasena' in data and check_password_hash(data['contrasenaNueva'], data['contrasena']) == False:
            return jsonify({'mensaje':'La contraseña no coincide'}), 401
        else:
            usuario.contrasena = generate_password_hash(data['contrasenaNueva'], method='sha256')
    if 'correo' in data:
        usuario.correo = data['correo']
    db.session.commit()
    return jsonify({'mensaje': 'Cambios guardados'}), 200

if __name__ == '__main__':
    app.run(debug=True)
