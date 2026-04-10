/**
 * Structured Logging Utility
 *
 * Provides consistent logging across the application with levels,
 * context, and error tracking support.
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  timestamp: string;
  error?: Error;
}

class Logger {
  private minLevel: LogLevel;
  private enableConsole: boolean;

  constructor() {
    // Set minimum log level based on environment
    this.minLevel =
      import.meta.env.MODE === 'production' ? LogLevel.WARN : LogLevel.DEBUG;
    this.enableConsole = import.meta.env.MODE !== 'test';
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.minLevel && this.enableConsole;
  }

  private formatMessage(entry: LogEntry): string {
    const timestamp = new Date(entry.timestamp).toISOString();
    const levelName = LogLevel[entry.level];
    const contextStr = entry.context ? ` ${JSON.stringify(entry.context)}` : '';
    const errorStr = entry.error ? ` ${entry.error.message}` : '';
    return `[${timestamp}] ${levelName}: ${entry.message}${contextStr}${errorStr}`;
  }

  private log(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) {
      return;
    }

    const message = this.formatMessage(entry);

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(message);
        break;
      case LogLevel.INFO:
        console.info(message);
        break;
      case LogLevel.WARN:
        console.warn(message);
        break;
      case LogLevel.ERROR:
        console.error(message, entry.error);
        break;
    }

    // In production, you could send logs to a service here
    // if (import.meta.env.MODE === 'production') {
    //   this.sendToLoggingService(entry);
    // }
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.log({
      level: LogLevel.DEBUG,
      message,
      context,
      timestamp: new Date().toISOString(),
    });
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log({
      level: LogLevel.INFO,
      message,
      context,
      timestamp: new Date().toISOString(),
    });
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.log({
      level: LogLevel.WARN,
      message,
      context,
      timestamp: new Date().toISOString(),
    });
  }

  error(
    message: string,
    error?: Error,
    context?: Record<string, unknown>
  ): void {
    this.log({
      level: LogLevel.ERROR,
      message,
      error,
      context,
      timestamp: new Date().toISOString(),
    });
  }

  // Convenience methods for common patterns
  apiCall(endpoint: string, method: string, duration?: number): void {
    this.debug(
      `API ${method} ${endpoint}`,
      duration ? { duration: `${duration}ms` } : undefined
    );
  }

  apiError(endpoint: string, error: Error): void {
    this.error(`API Error: ${endpoint}`, error);
  }

  performance(metric: string, value: number, unit: string = 'ms'): void {
    this.info(`Performance: ${metric}`, { value, unit });
  }

  userAction(action: string, details?: Record<string, unknown>): void {
    this.debug(`User Action: ${action}`, details);
  }
}

// Singleton instance
export const logger = new Logger();

// Export convenience functions
export const debug = (message: string, context?: Record<string, unknown>) =>
  logger.debug(message, context);

export const info = (message: string, context?: Record<string, unknown>) =>
  logger.info(message, context);

export const warn = (message: string, context?: Record<string, unknown>) =>
  logger.warn(message, context);

export const error = (
  message: string,
  err?: Error,
  context?: Record<string, unknown>
) => logger.error(message, err, context);

export default logger;
