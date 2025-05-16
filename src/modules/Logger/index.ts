import { logger, consoleTransport } from 'react-native-logs';

const customLogger = logger.createLogger({
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  },
  severity: 'debug',
  transport: consoleTransport,
  transportOptions: {
    colors: {
      info: 'blueBright',
      warn: 'yellowBright',
      error: 'redBright',
    },
  },
  async: true,
  dateFormat: 'time',
  printLevel: true,
  printDate: true,
  fixedExtLvlLength: false,
  enabled: true,
});

export default customLogger.extend('react-native-maps-navigation-ts');
