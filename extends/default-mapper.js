'use strict';

module.exports = options => {
    const { operator, name } = Object.assign({
        operator: '?',
        name: 'default'
    }, options);
    return function default_mapper(rt) {
        rt.presets.directives[operator] = (sval, tval, prop, host, fields, src, tar, index, ops) => {
            const valid = ('object' === typeof sval && !sval) || 'undefined' === typeof sval;
            if(valid) {
                const action = fields[name];
                sval = 'function' === typeof action ? action(tval, src, tar) : action;
            }
            return [sval, tval, prop, host];
        };
    };
};