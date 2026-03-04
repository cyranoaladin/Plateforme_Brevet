type LogLevel = 'INFO' | 'WARN' | 'ERROR';

/**
 * Système de logging sécurisé.
 * Supprime ou masque les données sensibles avant affichage.
 */
export const logger = {
  info: (message: string, context?: Record<string, unknown>) => log('INFO', message, context),
  warn: (message: string, context?: Record<string, unknown>) => log('WARN', message, context),
  error: (message: string, context?: Record<string, unknown>) => log('ERROR', message, context),
};

function log(level: LogLevel, message: string, context: Record<string, unknown> = {}) {
  // 1. Clonage pour éviter de modifier l'objet original
  const safeContext = JSON.parse(JSON.stringify(context)) as Record<string, unknown>;

  // 2. Redaction des champs sensibles connus
  const sensitiveFields = ['email', 'password', 'token', 'apiKey', 'query', 'userAnswer'];
  
  const redact = (obj: Record<string, unknown>) => {
    for (const key in obj) {
      if (sensitiveFields.includes(key)) {
        obj[key] = '[REDACTED]';
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        redact(obj[key] as Record<string, unknown>);
      }
    }
  };

  redact(safeContext);

  const timestamp = new Date().toISOString();
  const logString = `[${timestamp}] [${level}] ${message} ${Object.keys(safeContext).length > 0 ? JSON.stringify(safeContext) : ''}`;

  if (level === 'ERROR') {
    console.error(logString);
  } else if (level === 'WARN') {
    console.warn(logString);
  } else {
    console.log(logString);
  }
}
