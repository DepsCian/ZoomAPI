import Message from "@/types/messages"

class WebSocketService {
  private socket: WebSocket

  constructor(
    socket: WebSocket,
    messageHandler: (message: Message) => void
  ) {
    this.socket = socket
    this.socket.onmessage = async (event: MessageEvent) => {
      try {
        let dataString: string
        if (event.data instanceof Blob) {
          dataString = await event.data.text()
        } else {
          dataString = event.data.toString()
        }

        const jsonStartIndex = dataString.indexOf('{')
        if (jsonStartIndex !== -1) {
          const jsonString = dataString.substring(jsonStartIndex)
          const message = JSON.parse(jsonString)
          messageHandler(message)
        }
      } catch (e) {
        console.error("Failed to process WebSocket message:", e)
      }
    }
  }

  sendMessage(message: Message): void {
    this.socket.send(JSON.stringify(message))
  }
}

export default WebSocketService