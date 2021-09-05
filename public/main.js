'use strict';

var socket = io();
var userId = null
var peer = new Peer(undefined);
let connected_users = {}

// to join room
peer.on('open', id => {
  userId = id
  socket.emit('join-room', id, roomId)
})




let videoGrid = document.querySelector('#videos'); 

const localVideo = document.createElement('video'); // current user video
localVideo.muted = true;  

// let localStream;
// 
// function gotLocalMediaStream(mediaStream) {
//   localStream = mediaStream;
//   localVideo.srcObject = mediaStream;
// }

// Handles error by logging a message to the console with the error message.
function handleLocalMediaStreamError(error) {
  console.log('something wrong ', error);
}

// Initializes media stream.
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true,
})
  .then((stream) => {
    //  adding video to dom
    addVideo(localVideo, stream)
    //  answer call 
    peer.on('call', call => {
      call.answer(stream);
      const video = document.createElement('video')
      call.on('stream', newUserStream => {
        addVideo(video, newUserStream);
      })
      call.on('close', () => {
        video.remove()
      })
    })

    socket.on('user-joined', function (data) {
      //  if new user connected call to new user
      if (userId != data.userId) {
        connectToNewUser(data.userId, stream, data.sid);
      }
    });
  }).catch(handleLocalMediaStreamError);

//  on desconnect a user remove from dom
socket.on('user-desc', sid => {
  if (connected_users[sid]) {
    connected_users[sid].close()
  }
})

//  function to add video to the dom
function addVideo(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
    videoGrid.append(video)
  })
}

//  function to call newly connected user
function connectToNewUser(user_id, stream, sid) {
  const call = peer.call(user_id, stream)
  const video = document.createElement('video')

  call.on('stream', newUserStream => {
    addVideo(video, newUserStream)
  })
  call.on('close', () => {
    video.remove()
  })
  connected_users[sid] = call; // store user call for removing dom when desconnected 
}

