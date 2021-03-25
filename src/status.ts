export enum Status {
  STATE_LOGOUT = 'offline',
  STATE_IDLE = 'available',
  STATE_PAUSE = 'pause',
  STATE_MAKECALL_REQUEST = 'start_dialing',
  STATE_MAKECALL_FAILED = 'available',
  STATE_HOLD = 'on_hold',
  STATE_HOLD_DIALPAD = 'on_hold',
  STATE_HOLD_MAKECALL_PROGRESS = 'on_hold',
  STATE_CALL_ACTIVE = 'in_a_call',
  STATE_CLERICAL = 'clerical',
  STATE_CALL_DELIVERED = 'start_dialing',
}
