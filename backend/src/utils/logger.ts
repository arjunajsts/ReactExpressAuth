import { createLogger, format, transports, Logger } from 'winston';
import 'winston-daily-rotate-file';
// winston-mongodb does not have official TS definitions, we import it to load the transport
import 'winston-mongodb'; 

const logger: Logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    // 1. ALWAYS print clean, colored logs to your terminal console
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    }),

    // 2. Auto-rotating file storage (14-day history)
    new transports.DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      maxSize: '20m'
    }),

       // 3. Save errors directly into MongoDB
    new (transports as any).MongoDB({
      level: 'error',
      db: 'mongodb://localhost:27017/mydatabase', // Replace with your connection string
      collection: 'server_errors',
      capped: true,
      cappedSize: 10000000 
      // options object removed from here
    })

  ]
});

export default logger;
