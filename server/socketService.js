/* eslint-disable no-unused-vars */
import { Server } from "socket.io";

export default class SocketService {
  constructor(server) {
    this.io = new Server(server);
    this.io.on('connection', (socket) => {
      socket.on('tenant:join', (data) => {
        console.log('tenant:join', data);
      })
      socket.on('customer:join', (data) => {
        console.log('customer:join', data);
      })
    });
  }

  emiter({event, url, message, severity}) {
    if (event && url && message) {
      console.log('emiter', event, url, message);
      this.io.emit(event, {url , message, severity});
    }
  }
}
