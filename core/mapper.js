'use strict';

const { standardify, discovery, original } = require('./utils');

const Mapper = function(template, pathname = 'key') {

};

Mapper.install = function(plugin) {

};

Mapper.prototype = {
    constructor: Mapper,
    appear: function(source, target = {}) {

    }
};

const presets = Mapper.presets = { directives: {} };

module.exports = Mapper;