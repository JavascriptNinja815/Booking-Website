"use strict";


module.exports = {

    /**
     * @type function
     * @access public
     * @param app
     * @description Set Headers:
     *  1. Indicates whether or not the actual request can be made using credentials.
     *  2. Indicate which HTTP headers will be available when making the actual request.
     *  3. Specifies the method(s) allowed when accessing the resource in response to a preflight request.
     *  4. Allow any resource to access your resource.
     */
    setHeaders: (app) => {
        app.use((req, res, next) => {
            res.header('Access-Control-Allow-Credentials', true);
            res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Cache-Control, Content-Type, Origin');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
            res.header('Access-Control-Allow-Origin', req.headers.origin || '*');

            req.method === 'OPTIONS' ? res.sendStatus(200) : next();
        });
    }
};