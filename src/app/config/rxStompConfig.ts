import { InjectableRxStompConfig } from '@stomp/ng2-stompjs';



export const rxStompConfig: InjectableRxStompConfig = {
  // Which server?

   brokerURL: 'ws://localhost:8080/api',
 //brokerURL: 'ws://37.59.39.230:8080/api',

  // Headers
  // Typical keys: login, passcode, host
  // connectHeaders: {
  //   login: 'guest',
  //   passcode: 'guest'
  // },

  // How often to heartbeat?
  // Interval in milliseconds, set to 0 to disable
  heartbeatIncoming: 20000, // Typical value 0 - disabled
  heartbeatOutgoing: 20000, // Typical value 20000 - every 20 seconds

  // Wait in milliseconds before attempting auto reconnect
  // Set to 0 to disable
  // Typical value 5000 (5 seconds)
  reconnectDelay: 5000

  // Will log diagnostics on console
  // It can be quite verbose, not recommended in production
  // Skip this key to stop logging to console
  // debug: (msg: string): void => {
  // console.log(new Date(), msg);
  // }
};
