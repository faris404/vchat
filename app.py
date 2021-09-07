from werkzeug.utils import redirect
from models import app,socketio
from flask import render_template,request
from flask_socketio import emit,join_room

# store user sid and room information for deconnection
user_rooms = {} 

@app.route("/")
def starting():
   # room_id = 'test_room'
   return render_template('rooms.html')


@app.route("/room/<room_id>")
def toroom(room_id):
   return render_template('index.html',room=room_id)


@socketio.on('connect')
def test_connect():
   print('auth',request.sid)


@socketio.on('disconnect')
def test_disconnect():
   if (user_rooms.get(request.sid)):
      room_det = user_rooms.pop(request.sid)
      emit('user-desc',request.sid,to=room_det,broadcast=True)


@socketio.on('join-room')
def user_join_room(user_id,room_id):
   join_room(room_id)
   user_rooms[request.sid]= room_id
   emit('user-joined',{'userId':user_id,'sid':request.sid},to=room_id,broadcast=True)



if __name__=="__main__":
   socketio.run(app,debug=True)

# gunicorn --worker-class eventlet -w 1 app:app