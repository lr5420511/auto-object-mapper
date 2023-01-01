'use strict';

const { standardify, discovery, original } = require('./utils');

const Mapper = function(template, options) {
    const { pathname, switchname } = Object.assign({ pathname: 'key', switchname: 'ignore' }, options);
    let invalid = 'object' !== typeof template || !template || !pathname.length || !switchname.length;
    if(invalid) throw new Error('template or options is invalid.');
    const together = Object.keys(presets.directives).map(op => `\\${op}`).join('');
    invalid = [].some.call(together, op => '.[]'.indexOf(op) >= 0);
    if(invalid) throw new Error('Operator is invalid.');
    Object.assign(this, {
        template: standardify(template, together, pathname),
        pathname,
        switchname
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
        const [template, pathname, switchname, directives] = [
            this.template, this.pathname, this.switchname, presets.directives
        ];
        return Object.keys(template).reduce((res, srcPath) => {
            const [to, srcValue, srcProp, srcHost] = [
                template[srcPath], 
                ...discovery(source, srcPath)
            ];
            return to.reduce((res, fields) => {
                const invalid = fields[switchname] && 'undefined' === typeof srcValue &&
                    !(srcHost && srcHost.hasOwnProperty(srcProp));
                if(!invalid) {
                    const [tarPath, operators] = fields[pathname],
                        three = discovery(res, tarPath, true);
                    if(three) {
                        const [value, _, prop, host] = [].reduce.call(operators, (res, op, i, ops) =>
                            directives[op](...res, fields, source, target, i, ops),
                            [srcValue, ...three]
                        );
                        original(value, prop, host);
                    }
                }   
                return res;
            }, res);
        }, target);
    }
};

const presets = Mapper.presets = { directives: {} };

module.exports = Mapper;