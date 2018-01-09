# README #

This README would document whatever steps are necessary to get the application up and running.

* VliegDutch Application (server-side)
* 1.0.0

### How to Configure and Run ###

#####Dependencies
    * Node.js (6.11.0)
    * npm (5.0.3)

#####Configuration
    Make configuration changes in app.config.wrapper.config.js (development, production)
        HOST
        PORT
        PROTOCOL
        
#####Setup
    Required Environment variables:
        NODE_ENV (development*, production)
        LOG_LEVEL (error(0), warn(1), info(2)*, verbose(3), debug(4), silly(5))
    
        Note, * marks as default.
    
    
    Available commands
        npm install - in the project directory to set up dependencies.
        npm start - run the node server.
    
        *Command example to run: NODE_ENV=production LOG_LEVEL=info node ./bin/www
   
        
### Log ###

#####System Activity Logs
    System Activity Logs are in `logs` folder (root of the project).
    `activity-err.log` file contains both `error` & `warn` logs of the system.
    `activity-out.log` file by default contains `error`, `warn`, and `info` logs.
    
    Note, transporter for `activity-out.log` uses LOG_LEVEL variable to setup which logs should be written in the file.
    
    
### Swagger ###
    
#####Endpoint
    Protocol://Ip:Port/api-docs. (ex. - http://185.92.86.226:3000/api-docs). This will load the default example.
    Loaded page should have an input filed. Use Protocol://Ip:Port/api/v1/swagger.json to get the API's.
        (ex. http://185.92.86.226:3000/api/v1/swagger.json)