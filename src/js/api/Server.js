import {SERVER_CONFIG} from '../constants';
import io from 'socket.io-client';

let config = {
  host: 'http://localhost:3000',
  sslhost: '',
};

const secure = location.protocol == 'https:';

class Server {
  socket = null;
  sockmsg = [];
  methodListeners = {};
  messagesQueue = [];
  msgListeners = {};

  constructor({token} = {}) {
    this.token = token;
  }

  get connected() {
    return this.socket && this.socket.connected;
  }

  msgById(id) {
    return this.sockmsg.find(msg => msg.msgId === id);
  };

  getNewId() {
    return new Date().getTime();
  };

  setToken(value) {
    this.token = value;
  }

  connect(token) {
    let params = {
      'connect timeout': 500,
      'reconnect': true,
      'reconnection delay': 500,
      'reopen delay': 500,
      'max reconnection attempts': 10,
      secure: secure,
      'force new connection': true
    };

    if (token !== this.token) this.setToken(token);

    if (this.token) {
      // Works in node.js only
      // params.extraHeaders = {
      //     'Authorization': 'Bearer ' + this.token
      // };
      params.transportOptions = {
        polling: {
          extraHeaders: {
            'Authorization': 'Bearer ' + this.token
          }
        },
        websocket: {
          protocols: [this.token, 'backoffice']
        }
      }
    }

    this.socket = io.connect(
      secure ? config.sslhost : config.host,
      params
    );

    this.socket.on('connect', () => this.onConnect);

    this.socket.on('alert', response => {
      this.alertHandler(response);
    });

    this.socket.on('error', error => {
      console.error(error);
    });

    return true;
  }

  on(event, callback) {
    if (!this.socket) {
      if (!this.msgListeners[event]) {
        this.msgListeners[event] = [callback];
      } else {
        this.msgListeners[event].push(callback);
      }
      return;
    }
    if (event === 'connect') {
      this.socket.on(event, () => {
        this.onConnect();
        callback();
      });
      return;
    }
    this.socket.on(event, callback);
  }

  alertHandler = (response) => {
    const {msgId, data} = response;
    let request = this.msgById(msgId);
    console.error(request, data.message);
    alert(data.message);
    if (this.methodListeners[request.type][msgId]) {
      this.methodListeners[request.type][msgId](data);
      delete this.methodListeners[request.type][msgId];
    }
  };

  onConnect() {
    this.messagesQueue.forEach(data => this.socket.send(data.type, data.msg));
    Object.keys(this.msgListeners).forEach(event => {
      this.msgListeners[event].map(callback => {
        this.socket.on(event, data => callback(data))
      });
    });
  }

  disconnect() {
    this.socket.close();
  }

  send(type, data, callback) {
    let msg = {msgId: this.getNewId().toString(), data: data};
    this.sockmsg.push({type, ...msg});
    if (callback) {
      callback.msg = msg;
      this.addMethodListener(type, msg, callback);
    }
    if (!this.connected) {
      this.messagesQueue.push({type, msg});
      return;
    }
    this.socket.emit(type, msg);
  }

  addMethodListener(type, msg, fn) {
    if (!this.methodListeners[type]) {
      this.methodListeners[type] = {};
      this.methodListeners[type][msg.msgId] = fn;
      this.socket.on(type, response => {
        if (!this.methodListeners[type][response.msgId]) return;
        if (this.messagesQueue.length) {
          this.messagesQueue = this.messagesQueue.filter(msg => msg.msgId !== response.msgId);
        }
        let data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
        this.methodListeners[type][response.msgId](data);
        delete this.methodListeners[type][response.msgId];
      });
    }
    else {
      this.methodListeners[type][msg.msgId] = fn;
    }
  }
}

export default Server;