'use strict';

module.exports = options => {
    const { operator, name } = Object.assign({
        operator: '*',
        name: 'merge'
    }, options);
    return function merge_mapper(rt) {
        rt.presets.directives[operator] = (sval, tval, prop, host, fields, src, tar, index, ops) => {

        };
    };
};