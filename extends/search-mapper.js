'use strict';

module.exports = options => {
    const { operator, name } = Object.assign({ 
        operator: '#', 
        name: 'search' 
    }, options);
    return function search_mapper(rt) {
        rt.presets.directives[operator] = (sval, tval, prop, host, fields, src, tar, index, ops) => {
            const valid = Array.isArray(sval);
            if(valid) {
                let action = fields[name];
                action = ('function' === typeof action ? action(sval, src) : action) || '';
                sval = (action.match(/[^\.\[\]]+/g) || []).reduce((res, prop) =>
                    res.reduce((res, cur) => {
                        const valid = cur && cur.hasOwnProperty(prop);
                        if(valid) {
                            cur = cur[prop];
                            res.push(...(Array.isArray(cur) ? cur : [cur]));
                        }
                        return res;
                    }, []), sval
                );
            }
            return [sval, tval, prop, host];
        };
    };
};