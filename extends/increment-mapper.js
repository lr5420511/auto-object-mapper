'use strict';

module.exports = options => {
    const { operator, name } = Object.assign({
        operator: '>',
        name: 'increment'
    }, options);
    return function increment_mapper(rt) {
        rt.presets.directives[operator] = (sval, tval, prop, host, fields, src, tar, index, ops) => {

        };
    };
};