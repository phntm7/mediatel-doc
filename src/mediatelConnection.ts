import { io, Socket } from 'socket.io-client';
import { MediatelData } from './mediatelData';

export class MediatelConnection {
  private readonly client: Socket;
  private data: MediatelData;
  private host: string;
  private port: string;

  constructor(serverUrl) {
    this.client = io(serverUrl, {
      transports: ['websocket'],
      multiplex: false,
    });

    this.registerListeners();
  }

  registerListeners() {
    this.client.on('data', this.processIncoming);
    this.client.on('agentUnavailable', this.processUnavailable);
    this.client.on('remoteConnect', this.processRemoteConnection);
  }

  processIncoming(data: MediatelData) {
    this.data = data;
  }

  processUnavailable(data) {
    // Currently there are no agents available
    // We can show user some notification
  }

  processRemoteConnection(data: { host: string; port: string }) {
    this.host = data.host;
    this.port = data.port;
  }

  login(user: string, password: string, extension: string) {
    this.client.emit('data', {
      type: 'login',
      user,
      password,
      extension,
    });
  }

  logout() {
    if (this.client) {
      this.client.emit('data', {
        type: 'logout',
      });
    }
  }

  call(phoneNumber: string, queueName: string) {
    this.client.emit('data', {
      type: 'makeCall',
      phoneNumber,
      queueName: queueName || this.data.queues[0],
    });
  }

  endCall() {
    this.client.emit('data', {
      type: 'closeCall',
    });
  }

  setResult(id: number) {
    this.client.emit('data', {
      type: 'resolutionSet',
      id,
    });
  }

  getData(): MediatelData {
    return this.data;
  }
}
