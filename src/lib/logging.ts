import { pino } from "pino";

const log = process.env.NODE_ENV === 'development' ? pino(
    { level: 'info' },
    pino.transport({
        target: 'pino-pretty',
        options: { colorize: true }
    })
) : pino(
    { level: 'info' },
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