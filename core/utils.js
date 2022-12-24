'use strict';

const outs = exports;

// 使映射模版标准化
outs.standardify = function(template, operators, pathname) {
    const re = new RegExp(`^((?:[${operators}]*[^${operators}]+)*)([${operators}]*)$`);
    return Object.keys(template).reduce((res, key) => {
        const to = template[key];
        res[key] = (Array.isArray(to) ? to : [to]).map(cur => {
            const isObject = 'object' === typeof cur && cur,
                fields = { ...(isObject ? cur : {}) };
            fields[pathname] = (isObject ? cur[pathname] : cur).match(re).slice(1);
            return fields;
        });
        return res;
    }, {});
};

// 在对象实例中探索给定路径的值
outs.discovery = function(instance, path, creatable) {
    let res = [instance, ...Array(2).fill(null)];
    (path.match(/[^\.\[\]]+/g) || []).every((key, ki, keys) => {
        const host = res[0],
            isObject = 'object' === typeof host && host,
            exist = host && host.hasOwnProperty(key);
        res = isObject ? [host[key], key, host] : [undefined, keys[keys.length - 1], null];
        if(!exist && creatable) {
            const proxy = {};
            isObject && ki < keys.length - 1 && (host[key] = proxy);
            res = isObject ? [proxy, key, host] : null;
        }
        return res && res[2];
    });
    return res;
};

// 默认且保守的替换映射策略
outs.original = function(value, prop, host) {
    const valid = host && !host.hasOwnProperty(prop);
    if(valid) (host[prop] = value);
    return valid;
};