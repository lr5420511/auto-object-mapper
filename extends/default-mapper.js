'use strict';

module.exports = options => {
    const { operator, name } = Object.assign({
        operator: '?',
        name: 'default'
    }, options);
    return function default_mapper(rt) {
        rt.presets.directives[operator] = (sval, tval, prop, host, fields, src, tar, index, ops) => {

        };
    };
};