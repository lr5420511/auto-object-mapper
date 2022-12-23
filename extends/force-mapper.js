'use strict';

module.exports = options => {
    const { operator } = Object.assign({ operator: '!' }, options);
    return function force_mapper(rt) {
        rt.presets.directives[operator] = (sval, tval, prop, host, fields, src, tar, index, ops) => {

        };
    };
};