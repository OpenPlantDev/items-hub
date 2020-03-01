import * as http from "http";
import * as socketio from "socket.io";

export class SocketService {
  private _ioServer: socketio.Server;

  constructor(httpServer: http.Server) {
    this._ioServer = socketio.listen(httpServer);

    this._ioServer.on("connection", (socket: any) => {
      console.log(`a user connected`);
    });
  }

  public emitMessage(event: string, message: string) {
    // console.log(`Emitting message: ${event}: ${message}`);
    this._ioServer.emit(event, message);
  }
}
