type LogLevel = 'error' | 'warn' | 'info' | 'debug';

const levels: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

class Logger {
  private currentLevel: LogLevel;

  constructor(level: LogLevel = 'info') {
    this.currentLevel = level;
  }

  private shouldLog(level: LogLevel): boolean {
    return levels[level] <= levels[this.currentLevel];
  }

  error(message: string): void {
    if (this.shouldLog('error')) {
      console.error(`[ERROR] ${message}`);
    }
  }

  warn(message: string): void {
    if (this.shouldLog('warn')) {
      console.warn(`[WARN] ${message}`);
    }
  }

  info(message: string): void {
    if (this.shouldLog('info')) {
      console.log(`[INFO] ${message}`);
    }
  }

  debug(message: string): void {
    if (this.shouldLog('debug')) {
      console.debug(`[DEBUG] ${message}`);
    }
  }
}

export default Logger