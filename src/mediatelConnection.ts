import { io, Socket } from 'socket.io-client';
import { MediatelData } from './mediatelData';

export class MediatelConnection {
  private readonly client: Socket;
  private data: MediatelData;
  private host: string;
  private port: string;

  constructor(serverUrl) {
    this.client = io(serverUrl, {
      path: "/mediatel/socket.io",
      withCredentials: true,
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

  /**
   * Set pause from "pauseList". To disable pause, send id=0
   * @param id
   */
  pause(id) {
    this.client.emit('data', {
      type: 'pause',
      id,
    });
  }

  /**
   * Toggles "predictive" state. Turns on if it's off and vice versa
   */
  togglePredictive(): void {
    this.client.emit('data', {
      type: 'predictive',
    });
  }

  /**
   * Puts call on hold
   */
  holdCall() {
    this.client.emit('data', {
      type: 'holdCall',
    });
  }

  /**
   * Resumes call
   */
  endHoldCall() {
    this.client.emit('data', {
      type: 'retrieveCall',
    });
  }

  /**
   * Restarts mediatel agent. Use this method if agents stops responding to messages
   */
  exit() {
    this.client.emit('data', {
      type: 'exit',
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
