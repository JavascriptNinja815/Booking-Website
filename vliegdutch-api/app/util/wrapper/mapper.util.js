"use strict";

const _ = require('lodash');


module.exports = {

    /**
     * @type function
     * @access public
     * @param array
     * @param properties
     * @returns {Array}
     * @author Albert Hambardzumyan <hambardzumyan.albert@gmail.com>
     * @description Maps the properties from an array of objects.
     */
    mapPropertiesFromArrayOfObjects: (array, properties) => {
        return _.map(array, (object) => {
            return _.pick(object, properties);
        });
    }
};
