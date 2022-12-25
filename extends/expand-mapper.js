'use strict';

module.exports = options => {
    const { operator, name } = Object.assign({
        operator: '+',
        name: 'expand'
    }, options);
    return function expand_mapper(rt) {
        rt.presets.directives[operator] = (sval, tval, prop, host, fields, src, tar, index, ops) => {
            const valid = Array.isArray(tval);
            if(valid) {
                const action = fields[name],
                    [single, index] = Object.assign([false, tval.length], 
                        action && action(sval, tval, src, tar)
                    );
                sval = [
                    ...tval.slice(0, index),
                    ...(Array.isArray(sval) && !single ? sval : [sval]),
                    ...tval.slice(index) 
                ];
            }
            return [sval, tval, prop, host];
        };
    };
};