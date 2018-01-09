"use strict";

const swaggerJSDoc = require('swagger-jsdoc');


const swaggerDefinition = {
    info: {
        title: 'VliegDutch',
        version: '1.0.0',
        description: 'VliegDutch REST API'
    }
};


module.exports = {

    /**
     * @type function
     * @access public
     * @param basePath
     * @param APIs
     * @returns {*|array}
     * @author Albert Hambardzumyan <hambardzumyan.albert@gmail.com>
     * @description Generate swaggerJSDoc.
     */
    init: (basePath, APIs) => {
        swaggerDefinition.basePath = basePath;

        const options = {
            swaggerDefinition: swaggerDefinition,
            apis: APIs
        };

        return swaggerJSDoc(options);
    }
};