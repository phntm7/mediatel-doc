import { Command } from './command';
import { CallCode } from './callCode';
import { State } from './state';
import { Status } from './status';

export interface MediatelData {
  agentExt: string; // mediatel extension
  agentId: number; // mediatel id
  agentName: string; // mediatel login
  ani: string; // phone number
  availableCommand: Command[];
  availableCallCodes: CallCode[];
  callCustomerID: string;
  callErrorID: string; // -223
  callErrorText: string; // No Answer from agent
  callStartTime: string; // 1999-01-01 01:01:01
  callTraceID: string;
  callType: number;
  callWaitDuration: string;
  crmConnectTarget?: string;
  crmConnectType?: string;
  dnis: string;
  holdQueue?: string;
  host: string; // MTAgentFarm-CEUA-110-0-01
  isAvailable: boolean;
  loginAttempt: number;
  loginErrorID?: string;
  loginErrorText?: string;
  maxCallDuration: number;
  mcc?: any;
  mute?: number;
  pauseId: number;
  pauseList: string[][];
  predictiveStatus: number;
  queueId: string; // Current queue id
  queueName: string; // Current queue name
  queues: string[];
  serverTime: number; // 1616654561933
  state: State;
  status: Status;
  time: number; // 1616656070589
  webServer: string;
}
