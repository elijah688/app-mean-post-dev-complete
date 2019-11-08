let io;

module.exports = {
  init: httpServer => {
    io = require('socket.io')(httpServer)
    return io;
  },
  getIO: ()=>{
    if(io===undefined){
      throw new Error("Socket.io not initiallized!")
    }
    else {
      return io;
    }
  }
}
