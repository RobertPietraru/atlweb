import { pino, multistream } from "pino";
import fs from "fs";

// Ensure logs directory exists
if (process.env.NODE_ENV === 'development') {
    if (!fs.existsSync('./logs')) {
        fs.mkdirSync('./logs');
    }
}

// Create a writable stream for logging to a file
const logFile = pino.destination('./logs/app.log');

// Create a pretty-print stream for the console
const prettyStream = pino.transport({
    target: 'pino-pretty', // Pretty prints logs in the console
    options: { colorize: true } // Adds colors to console logs
});

// Create a logger with multiple streams
const log = pino(
    { level: 'info' },
    multistream([
        { stream: prettyStream },  // Pretty logs to console
        { stream: logFile }        // Raw logs to file
    ])
);

// Log unhandled exceptions
process.on('uncaughtException', (error) => {
    log.fatal(error, 'Uncaught Exception');
});

// Log unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    log.fatal({
        reason,
        promise
    }, 'Unhandled Promise Rejection');
});

export default log;