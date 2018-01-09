"use strict";

const fs = require('fs'),
    path = require('path');

const winston = require('winston');

const appDir = path.join(path.dirname(require.main.filename), '../');


winston.setLevels({
    error: 0,
    warn: 1,
    info: 2,
    verbose: 3,
    debug: 4,
    silly: 5
});

winston.addColors({
    error: 'red',
    warn: 'yellow',
    info: 'green',
    verbose: 'cyan',
    debug: 'blue',
    silly: 'magenta'
});

/**
 * @description Create `logs` directory, if not exists.
 */
fs.existsSync(`${appDir}/logs`) || fs.mkdirSync(`${appDir}/logs`, 0o777);


let logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            level: process.env.LOG_LEVEL,
            colorize: true,
            timestamp: false,
            silent: false,
            prettyPrint: false,
            stderrLevels: ['error'],
            handleExceptions: true
        }),
        new (winston.transports.File)({
            name: 'out',
            filename: `${appDir}/logs/activity-out.log`,
            level: process.env.LOG_LEVEL,
            colorize: true,
            timeStamp: true,
            silent: false,
            prettyPrint: true,
            stderrLevels: ['error'],
            handleExceptions: true,
            maxsize: 5 * 1024 * 1024, //5Mb
            maxFiles: 10
        }),
        new (winston.transports.File)({
            name: 'err',
            filename: `${appDir}/logs/activity-err.log`,
            level: 'warn',
            colorize: true,
            timeStamp: true,
            silent: false,
            prettyPrint: true,
            stderrLevels: ['error'],
            handleExceptions: true,
            maxsize: 5 * 1024 * 1024, //5Mb
            maxFiles: 10
        })
    ]
});


module.exports = logger;