let winston = require('winston');

const logFormat = winston.format.printf(info => {
    return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.label({ label: 'APP' }),
        winston.format.timestamp(),
        logFormat
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            level: 'info',
            filename: './app.log',
            handleExceptions: true,
            json: true,
            maxsize: 5242880, //5MB
            colorize: true
        })
    ]
});

module.exports = logger;