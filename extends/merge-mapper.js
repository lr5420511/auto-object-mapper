'use strict';

module.exports = options => {
    const { operator, name } = Object.assign({
        operator: '*',
        name: 'merge'
    }, options);
    return function merge_mapper(rt) {
        rt.presets.directives[operator] = (sval, tval, prop, host, fields, src, tar, index, ops) => {
            let valid = 'object' === typeof sval || 'undefined' === typeof sval;
            valid = valid && 'object' === typeof tval && tval;
            if(valid) {
                const regular = fields[name];
                sval = Object.keys(sval || {}).reduce((res, key) => {
                    const exclude = regular && regular.test(key);
                    exclude || (res[key] = sval[key]);
                    return res;
                }, { ...tval });
            }
            return [sval, tval, prop, host];
        };
    };
};