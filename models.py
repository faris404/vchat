from flask import Flask
from flask_socketio import SocketIO

app = Flask(__name__,static_folder='./public',static_url_path='/static')
app.config['SECRET_KEY'] = 'p\x7f\xfc\x11#S\x94c\xc0\x9f\x1brp#\xa3\x12R\xa5\xe2u\xe7\\k&'
socketio = SocketIO(app, cors_allowed_origins="*")