import * as JsSIP from 'jssip';
import { RTCSession } from 'jssip/lib/RTCSession';

const callOptions = {
  mediaConstraints: {
    audio: true, // only audio calls
    video: false,
  },
  pcConfig: {
    iceServers: [
      {
        urls: ['stun:stun.l.google.com:19302'],
      },
    ],
  },
  rtcOfferConstraints: {
    offerToReceiveAudio: true,
    offerToReceiveVideo: false,
  },
};

export class WebRTC {
  socket: JsSIP.Socket;
  phone: JsSIP.UA;
  phoneNumber: string;
  private session: RTCSession;

  constructor(
    webSocketAddress: string,
    login: string,
    realm: string,
    password: string,
  ) {
    this.socket = new JsSIP.WebSocketInterface(webSocketAddress);

    const sipConfig = {
      sockets: [this.socket],
      uri: `sip:${login}@${realm}`,
      password: password,
      display_name: login,
      realm: realm,
      session_timers_refresh_method: 'invite',
      register_expires: 300,
    };

    this.phone = new JsSIP.UA(sipConfig);
    this.registerEvents();

    this.phone.start();
  }

  registerEvents() {
    this.phone.on('newRTCSession', (data) => {
      const session = data.session;

      if (session.direction === 'incoming') {
        this.answer();
      }

      this.phoneNumber = session.remote_identity;

      session.on('addstream', (e) => {
        // Audio stream
        console.log(e.stream);
      });
      
      session.on('peerconnection', (data) => {
        data.peerconnection.onaddstream = (event) => {
          console.log('session onaddstream')
          // remoteAudio is an <audio> element
          remoteAudio.srcObject = event.stream
          remoteAudio.play()
        }
      })

      this.session = session;
    });
  }

  answer() {
    this.session.answer(callOptions);
  }
}
