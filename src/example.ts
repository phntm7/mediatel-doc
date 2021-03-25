// Создаем подключение к webrtc
import { WebRTC } from './webrtc';
import { MediatelConnection } from './mediatelConnection';

const realm = 'webrtc-hes.creditkasa.ua';
const webrtcSocketUrl = 'wss://webrtc-hes.creditkasa.ua/ws';
const login = 'mt_agent1';
const password = 'password';
const extension = '123';

// Подключаемся к webrtc
// При поступлении звонка автоматически принимаем звонок
const webrtc = new WebRTC(webrtcSocketUrl, login, realm, password);

// Создаем подключение по websocket
const mediatel = new MediatelConnection('mediatel-hes.creditkasa.ua');

// После подключения mediatel.data будет иметь такой вид:
/**
 {
   agentExt: ""
   agentId: "-1"
   agentName: ""
   ani: ""
   avaliableCommand: ["CMD_EXIT", "CMD_REQ_PAUSE_LIST", "CMD_REQ_CRT_DETAILS", "CMD_LOGIN"]
   awaliableCallCodes: [{Name: "10. Обещание об оплате", ID: "4", ActionFlag: "0"},…]
   callCustomerID: "-1"
   callHistory: []
   callStartTime: "1999-01-01 01:01:01"
   callTraceID: "-1"
   callType: "-1"
   callWaitDuration: "0"
   dnis: ""
   host: "MTAgentFarm-CEUA-110-0-01"
   isAvaliable: true
   loginAttempt: 4
   loginErrorID: "0"
   maxCallDuration: "0"
   pauseId: "0"
   pauseList: [["1", "Technical Break"], ["2", "Talk with Supervisor"], ["3", "Technical Error"], ["4", "Meeting"],…]
   predictiveStatus: "0"
   queueId: "-1"
   queueName: ""
   queues: [""]
   serverTime: 1616661902768
   state: "STATE_LOGOUT"
   status: "offline"
   time: null
   webServer: ""
 }
 */

// Логинимся
mediatel.login(login, password, extension);

// this.data примет следующий вид:
/**
  {
    agentExt: "123"
    agentId: "2705"
    agentName: "mt_agent1"
    ani: ""
    avaliableCommand: ["CMD_PAUSE", "CMD_EXIT", "CMD_DIALPAD", "CMD_REQ_PAUSE_LIST", "CMD_LOGOUT", "CMD_MAKECALL",…]
    awaliableCallCodes: [{Name: "10. Обещание об оплате", ID: "4", ActionFlag: "0"},…]
    callCustomerID: "-1"
    callHistory: []
    callStartTime: "1999-01-01 01:01:01"
    callTraceID: "-1"
    callType: "-1"
    callWaitDuration: "0"
    dnis: ""
    host: "MTAgentFarm-CEUA-110-0-01"
    isAvaliable: true
    loginAttempt: 5
    maxCallDuration: "0"
    mute: 0
    pauseId: "0"
    pauseList: [["6", "Agent Survey"], ["102", "Online chat"], ["1", "Technical Break"],…]
    predictiveStatus: "0"
    queueId: "-1"
    queueName: ""
    queues: ["Q_P_2_Manual", "QQ_Russia_Test_IT_Anonim"]
    serverTime: 1616662008180
    state: "STATE_IDLE"
    status: "available"
    time: 1616662007723
    webServer: "javascript:window.external.CRMNavigate("AgentSurvey","Agent Survey","http://mccdb.creditexpress.ua/AgentSurveyKyiv/",false);"
  }
 */

// Список очердей
mediatel.getData().queues;

// Если status = available мы можем совершать звонки
// При совершении звонка необходимо указать очередь
const queue = mediatel.getData().queues[0];
mediatel.call('18001234567', queue);

// mediatel.data:
/**
 * {
 *   state: "STATE_MAKECALL_REQUEST"
 *   status: "start_dialing"
 * }
 */

// При успешном дозвоне состояние меняется на STATE_CALL_DELIVERED
// В параметре awaliableCallCodes список доступных колл кодов для очереди, с которой делается звонок
// {
//   state: "STATE_CALL_DELIVERED"
//   status: "start_dialing"
//   awaliableCallCodes: [...]
// }

// Во время звонка состояние меняется на:
// {
//   state: "STATE_CALL_ACTIVE"
//   status: "in_a_call",
//   ani: "18001234567"
// }

// Завершаем звонок:
mediatel.endCall();

// По завершению звонка состояние меняется на clerical и в этом сотоянии можно передать колл код из списка awaliableCallCodes
// {
//   state: "STATE_CLERICAL"
//   status: "clerical"
// }

mediatel.setResult(15);
