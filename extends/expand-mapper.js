'use strict';

module.exports = options => {
    const { operator, name } = Object.assign({
        operator: '+',
        name: 'expand'
    }, options);
    return function expand_mapper(rt) {
        rt.presets.directives[operator] = (sval, tval, prop, host, fields, src, tar, index, ops) => {

        };
    };
};