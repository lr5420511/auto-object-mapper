'use strict';

module.exports = options => {
    const { operator, name } = Object.assign({
        operator: '-',
        name: 'transform'
    }, options);
    return function transform_mapper(rt) {
        rt.presets.directives[operator] = (sval, tval, prop, host, fields, src, tar, index, ops) => {
            const action = fields[name];
            return action ? action(sval, tval, prop, host, tar) : [sval, tval, prop, host];
        };
    };
};