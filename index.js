//By Sonika:

const serverConnection = require('server');
const { get, socket } = serverConnection.router;
const { render } = serverConnection.reply;

const updateCount = ctx => {
    ctx.io.emit('count', Object.keys(ctx.io.sockets.sockets).length);
};

serverConnection([
  get('/', ctx => render('chatdisplay.html')),
  socket('connect', updateCount),
  socket('disconnect', updateCount),
  socket('message', ctx => {
    console.log(ctx.data);
    ctx.io.emit('message', ctx.data);
  })
]);
