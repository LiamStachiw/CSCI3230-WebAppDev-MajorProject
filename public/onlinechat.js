//By: Sonika 

//Retrieving the username  
var userName = cookie.get('userName');
if (!user) {

  userName = prompt('Choose your username:');
  if (!userName) {
    alert('Invalid username!');
  } else {
    cookie.set('userName', userName);
  }
}

var socket = io();

socket.on('count', function (data) {
  $('.userCount').html(data);
});

socket.on('userMessage', function (data) {
  $('.chat').append('<p><strong>' + data.userName + '</strong>: ' + data.userMessage + '</p>');
});

$('form').submit(function (i) {
  i.preventDefault();

  // Retrieve the message from the user
  var userMessage = $(i.target).find('inputMessage').val();

    //Below we are sending the message
  socket.emit('userMessage', {
    userName: cookie.get('userName') || 'Anonymous',
    userMessage: userMessage
  });

  i.target.reset();
  $(i.target).find('inputMessage').focus();
});
