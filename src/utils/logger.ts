import fs from 'fs';
import path from 'path';

type LogLevel = 'INFO' | 'ERROR' | 'DEBUG' | 'WARNING';

class Logger {
  private static instance: Logger;
  private logFilePath: string;

  private constructor() {
    this.logFilePath = path.join(process.cwd(), 'logs.json');
    this.initLogFile();
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private initLogFile(): void {
    if (!fs.existsSync(this.logFilePath)) {
      fs.writeFileSync(this.logFilePath, JSON.stringify([], null, 2));
    }
  }

  public log(level: LogLevel, message: string, data?: any): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      data: data || null
    };

    console.log(`[${timestamp}] [${level}] ${message}`);
    
    try {
      const logs = this.readLogs();
      logs.push(logEntry);
      fs.writeFileSync(this.logFilePath, JSON.stringify(logs, null, 2));
    } catch (error) {
      console.error('Error writing to log file', error);
    }
  }

  private readLogs(): any[] {
    try {
      const data = fs.readFileSync(this.logFilePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  public info(message: string, data?: any): void {
    this.log('INFO', message, data);
  }

  public error(message: string, data?: any): void {
    this.log('ERROR', message, data);
  }

  public debug(message: string, data?: any): void {
    this.log('DEBUG', message, data);
  }

  public warning(message: string, data?: any): void {
    this.log('WARNING', message, data);
  }
}

export default Logger.getInstance(); 