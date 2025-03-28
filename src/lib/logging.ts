import { pino } from "pino";

const prettyStream = pino.transport({
    target: 'pino-pretty',
    options: { colorize: true }
});

const log = pino(
    { level: 'info' },
    prettyStream
);

process.on('uncaughtException', (error) => {
    log.fatal(error, 'Uncaught Exception');
});

process.on('unhandledRejection', (reason, promise) => {
    log.fatal({
        reason,
        promise
    }, 'Unhandled Promise Rejection');
});

export default log;