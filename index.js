'use strict';

/**
 * 
 * Copyright (c) 2022 Alex liao, All rights reserved.
 * 
 * ------------------------------------------------------------------------------------------------
 * 
 * 这是一个源对象到目标对象的映射工具，支持通过不同指令的组合方式，实现不同的映射效果。
 * 
 * > 帮助你完成有状态目标对象的映射。
 * 
 * > 帮助你完成有深度属性对象的值的映射。
 * 
 * > 帮助你完成从一个源属性值到多个目标属性值的映射。
 * 
 * > 帮助你完成通过在路径尾部自由组合指令集的方式，实现定制的映射效果。
 * 
 * > 可通过配置安装自定义指令的方式，拓展需要的映射效果。
 * 
 * 注意：在没有任何指令的前提下，默认的映射替换策略是最保守的，即目标对象若拥有指定属性则跳过赋值，否则新增属性并赋值。
 * 
 */

require('babel-polyfill');
const ObjectMapper = require('./core/mapper');
const default_mapper = require('./extends/default-mapper');
const expand_mapper = require('./extends/expand-mapper');
const force_mapper = require('./extends/force-mapper');
const increment_mapper = require('./extends/increment-mapper');
const merge_mapper = require('./extends/merge-mapper');
const transform_mapper = require('./extends/transform-mapper');
const search_mapper = require('./extends/search-mapper');

module.exports = [
    default_mapper,
    expand_mapper,
    force_mapper,
    increment_mapper,
    merge_mapper,
    transform_mapper,
    search_mapper
].reduce((mapper, generator) => mapper.install(generator()), ObjectMapper);