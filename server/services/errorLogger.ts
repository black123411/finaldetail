export enum LogLevel {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

export interface SystemLog {
  level: LogLevel;
  source: string;
  message: string;
  details?: any;
  timestamp?: Date;
  context?: {
    userId?: string;
    path?: string;
    method?: string;
    requestId?: string;
  };
}

export async function logToSystem(log: Omit<SystemLog, 'timestamp'>) {
  try {
    const logData = {
      ...log,
      timestamp: new Date(),
    };

    console.log(`[${log.level.toUpperCase()}] [${log.source}] ${log.message}`, log.details || '');
  } catch (err) {
    console.error('CRITICAL: Failed to write to system_logs:', err);
  }
}

export async function logSquareError(source: string, message: string, error: any, context?: SystemLog['context']) {
  const details = {
    message: error.message,
    stack: error.stack,
    name: error.name,
    code: error.code,
    // Square specific error details if available
    errors: error.errors || []
  };

  await logToSystem({
    level: LogLevel.ERROR,
    source,
    message,
    details,
    context
  });
}
