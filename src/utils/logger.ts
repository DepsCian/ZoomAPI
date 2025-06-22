export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

const STYLES: Record<LogLevel, string> = {
  error: 'color: red; font-weight: bold;',
  warn: 'color: orange;',
  info: 'color: lightblue;',
  debug: 'color: gray;',
};

const levels: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const CONSOLE_METHODS: Record<LogLevel, 'error' | 'warn' | 'info' | 'debug'> = {
  error: 'error',
  warn: 'warn',
  info: 'info',
  debug: 'debug',
};

export default class Logger {
  public error!: (...args: any[]) => void;
  public warn!: (...args: any[]) => void;
  public info!: (...args: any[]) => void;
  public debug!: (...args: any[]) => void;

  constructor(name: string, level: LogLevel = 'info') {
    (Object.keys(CONSOLE_METHODS) as LogLevel[]).forEach(logLevel => {
      if (levels[logLevel] <= levels[level]) {
        const prefix = `%c[${name}] [${logLevel.toUpperCase()}]`;
        const style = STYLES[logLevel];
        const consoleMethod = CONSOLE_METHODS[logLevel];

        this[logLevel] = console[consoleMethod].bind(console, prefix, style);
      } else {
        this[logLevel] = () => {};
      }
    });
  }
}