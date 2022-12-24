'use strict';

const { standardify, discovery, original } = require('./utils');

const Mapper = function(template, pathname = 'key') {
    let invalid = 'object' !== typeof template || !template || !pathname.length;
    if(invalid) throw new Error('template or pathname is invalid.');
    const together = Object.keys(presets.directives).map(op => `\\${op}`).join('');
    invalid = [].some.call(together, op => '.[]'.indexOf(op) >= 0);
    if(invalid) throw new Error('Operator is invalid.');
    Object.assign(this, {
        template: standardify(template, together, pathname),
        pathname
    });
};

Mapper.install = function(plugin) {
    const plugins = Mapper.plugins = Mapper.plugins || [];
    // Install plugin
    plugin(Mapper);
    return plugins.push(plugin) && Mapper;
};

Mapper.prototype = {
    constructor: Mapper,
    appear: function(source, target = {}) {
        const invalid = [source, target].some(cur => 'object' !== typeof cur || !cur);
        if(invalid) throw new Error('source or target is invalid.');
        const [template, pathname, directives] = [
            this.template, this.pathname, presets.directives
        ];
        return Object.keys(template).reduce((res, srcPath) => {
            const [to, srcValue] = [template[srcPath], discovery(source, srcPath)[0]];
            return to.reduce((res, fields) => {
                const [tarPath, operators] = fields[pathname],
                    three = discovery(res, tarPath, true);
                if(three) {
                    const [value, _, prop, host] = [].reduce.call(operators, (res, op, i, ops) =>
                        directives[op](...res, fields, source, target, i, ops),
                        [srcValue, ...three]
                    );
                    original(value, prop, host);
                }
                return res;
            }, res);
        }, target);
    }
};

const presets = Mapper.presets = { directives: {} };

module.exports = Mapper;