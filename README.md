### Интеграция с Mediatel

- Для подключения к SIP телефонии через WebRTC мы используем библиотеку [JsSIP](https://github.com/versatica/JsSIP).
- Для подключения к Mediatel сервису мы используем библиотеку (Socket.IO)[https://github.com/socketio/socket.io-client] 

### Пример подключения к Mediatel
*Пример кода находится в src/mediatelConnection.ts*

```typescript
import { MediatelConnection } from './mediatelConnection';

const serverUrl = 'mediatel-hes.creditkasa.ua';

// Создаем подключение по websocket
const mediatel = new MediatelConnection(serverUrl);
```

После подключения сервис пришлет текущее состояние (Событие "data"). Приблизительный вид:

```json
{
   "agentExt": "",
   "agentId": "-1",
   "agentName": "",
   "ani": "",
   "avaliableCommand": ["CMD_EXIT", "CMD_REQ_PAUSE_LIST", "CMD_REQ_CRT_DETAILS", "CMD_LOGIN"],
   "awaliableCallCodes": [{"Name": "10. Обещание об оплате", "ID": "4", "ActionFlag": "0"}],
   "callCustomerID": "-1",
   "callHistory": [],
   "callStartTime": "1999-01-01 01:01:01",
   "callTraceID": "-1",
   "callType": "-1",
   "callWaitDuration": "0",
   "dnis": "",
   "host": "MTAgentFarm-CEUA-110-0-01",
   "isAvaliable": true,
   "loginAttempt": 4,
   "loginErrorID": "0",
   "maxCallDuration": "0",
   "pauseId": "0",
   "pauseList": [["1", "Technical Break"], ["2", "Talk with Supervisor"], ["3", "Technical Error"], ["4", "Meeting"]],
   "predictiveStatus": "0",
   "queueId": "-1",
   "queueName": "",
   "queues": [""],
   "serverTime": 1616661902768,
   "state": "STATE_LOGOUT",
   "status": "offline",
   "time": null,
   "webServer": ""
 }
```
<hr>

**В параметре avaliableCommand находится список команд, которые мы можем отправлять в текущем состоянии.**

<hr>

Если состояние "STATE_LOGOUT", можем логиниться:
```typescript
mediatel.login(login, password, extension);
```

При успешном логине состояние поменяется на:
```typescript
    state: "STATE_IDLE"
    status: "available"
```

В состоянии STATE_IDLE мы можем совершать звонки.
Для звонка необходимо указать очередь из списка очередей (параметр queues).

```typescript
const queue = mediatel.getData().queues[0];
mediatel.call('18001234567', queue);
```

Состояние поменяется на:
```typescript
  ...
  state: "STATE_MAKECALL_REQUEST"
  status: "start_dialing"
  ...
```

При успешном дозвоне состояние меняется на STATE_CALL_DELIVERED
В этом состоянии в параметре awaliableCallCodes приходит список доступных колл кодов для очереди, с которой делается звонок.
**В это время в webrtc поступает входящий звонок.**


```typescript
  ...
  state: "STATE_CALL_DELIVERED"
  status: "start_dialing"
  awaliableCallCodes: [...]
  ...
```

Во время звонка состояние меняется на:
```typescript
  ...
  state: "STATE_CALL_ACTIVE"
  status: "in_a_call"
  ...
```

Пример полного состояния во время звонка:
```json
{
  agentExt: "webrtc-2016",
  agentId: "329"
  agentName: "AKramarenko"
  ani: "0661234567"
  avaliableCommand: ["CMD_ADD_CALL_INFO", "CMD_PAUSE", "CMD_EXIT", "CMD_HOLDCALL", "CMD_REQ_PAUSE_LIST", "CMD_MUTE",…]
  awaliableCallCodes: [{Name: "10.Обещание об оплате", ID: "4", ActionFlag: "0"},…]
  callCustomerID: "39553609"
  callHistory: [{MCC_SAMPLEID: "39553609", MCC_CHANNEL: "35", MCC_CALLTYPE: "3", MCC_CALLBACKID: "-1",…},…]
  callStartTime: "2021-03-25 11:58:15"
  callTraceID: "1185574264"
  callType: "3"
  callWaitDuration: "0"
  crmConnectTarget: ""
  crmConnectType: "3"
  dnis: "77@192.168.1.1:5060"
  host: "MTAgentFarm-CEUA-110-0-01"
  isAvaliable: true
  lastCallTime: 0
  loginAttempt: 2
  maxCallDuration: "180"
  multipleCallCodeAllow: "0"
  mute: 0
  pauseAcknowledge: "0"
  pauseId: "0"
  pauseList: [["6", "Agent Survey"], ["102", "Online chat"], ["1", "Talk with Supervisor"],…]
  predictiveStatus: "1"
  queueId: "9"
  queueName: "DM_MFO_1"
  queues: ["DM_Banks_ManualCalls"]
  serverTime: 1616666470942
  state: "STATE_CALL_ACTIVE"
  status: "in_a_call"
  time: 1616666313139
  webServer: ""
}
```

По завершению звонка состояние меняется на STATE_CLERICAL и в этом состоянии можно передать колл код из списка awaliableCallCodes:
```typescript
  ...
  state: "STATE_CLERICAL"
  status: "clerical"
  ...
```

```typescript
mediatel.setResult(15);
```

После выбора колл кода или по таймауту состояние вернется в STATE_IDLE. Можно совершать следующий звонок.


### Пример подключения к WebRTC:
Пример кода находится в файле src/webrtc.ts.
После подключения мы принимаем входящие подключения и при входящем звонке автоматически принимаем звонок.

```typescript
import { WebRTC } from './webrtc';

const realm = 'webrtc-hes.creditkasa.ua';
const webrtcSocketUrl = 'wss://webrtc-hes.creditkasa.ua/ws';
const login = 'mt_agent1';
const password = 'password';

// Подключаемся к webrtc
// При поступлении звонка автоматически принимаем звонок
const webrtc = new WebRTC(webrtcSocketUrl, login, realm, password);

```
