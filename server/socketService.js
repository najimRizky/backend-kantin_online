/* eslint-disable no-unused-vars */
import { Server } from "socket.io";

export default class SocketService {
  constructor(server) {
    this.io = new Server(server);
    this.io.on('connection', (socket) => {
      socket.on('tenant:join', (data) => {
        socket.join(data);
      })
    });
  }

  emiter({event, url, message}) {
    if (event && url && message) {
      this.io.emit(event, {url , message});
    }
  }
}
