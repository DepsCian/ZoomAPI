import Message from "./types/messages"

class ZoomWS {
  socket: WebSocket 

  constructor(socket: WebSocket) {
    this.socket = socket
  }

  sendMessage(message: Message): void {
    this.socket.send(JSON.stringify(message))

  }
}

export default ZoomWS