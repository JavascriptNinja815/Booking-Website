# README #

This README would document whatever steps are necessary to get the application up and running.

### What is this repository for? ###

* VliegDutch Application (Desktop)
* 1.0.0

### How to Configure and Run ###

##### Dependencies
    * Node.js (6.11.0)
    * npm (5.0.3)
    * bower (1.8.0)
    * gulp (3.9.1)
    * http-server (0.10.0)
    
    * pm2 (production)
    
##### Deploy on server

    npm install - in the project directory to set up dependencies.
    bower install - in the project directory to set up dependencies.    
    gulp build - in the project directory to apply project minification.
    pm2 start filename.sh - in the ./dist directory to start the server.
    
    pm2 restart id - to restart the server.