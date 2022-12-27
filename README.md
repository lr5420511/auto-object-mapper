# auto-object-mapper
这是一个`源对象`到`目标对象`的映射工具，支持通过`不同指令`的`组合`方式，实现不同的`映射效果`。

# 关于
为什么要编写这个代码库，它能解决什么问题？为了从那些`无聊枯燥`且`毫无营养`，但是又必须去做的`重复工作`中解脱出来，编写一个`Object`到`Object`的对象属性复制映射代码库是值得的。我希望这个代码库在功能上能够支持，通过`绑定不同指令`的方式去`干涉并改变`默认的对象映射行为。通过不同的指令`组合`在一起使用，能够达到在指令层面上的`逻辑编程`的目的。到目前为止，我并没有发现能够完全满足我需要的已经存在的其他代码库，所以我决定自己编写一个，以解决遇到的`困境`。

# 安装
```shell
npm install --save auto-object-mapper
```

# 用法
通过配置`对象字面量`并`初始化`映射对象的方式，告诉程序映射的`源头`在哪里，映射到`何处`。键值对中的**key**表示`源对象`中映射源头的`查找路径`，它所对应的**value**则表示`目标对象`中映射目的地的`查找路径`。

## 初始化对象映射实例
因为通过该包导出的是一个**ObjectMapper**类型，我们传递一个`映射清单`给**ObjectMapper**类型的`构造函数`，可以直接初始化出一个`对象映射实例`。就像这样：
```javascript
const ObjectMapper = require('auto-object-mapper');

const mapper = new ObjectMapper({ [srcPath]: [tarPath] });
// srcPath和tarPath是源对象查找路径和目标对象查找路径
```

## 源对象查找路径
`源对象`的映射源头`查找路径`可以是一个`简单`的`字符串`，代表单一的`属性`，就像这样：
```javascript
{
    'baz': 'bas',
    'ase': 'taz.bas'
}
```

`源对象`的映射源头`查找路径`也可以是一个通过特殊字符 ***.*** ***[*** ***]*** 串联起来的`路径字符串`，代表一个可以找到对象指定属性的`查找路径`，就像这样：
```javascript
{
    'baz.bas': 'foo',
    'baz[0].bas': 'xzz'
}
```

`源对象`的映射源头`查找路径`也可以是一个`空字符串`，代表源对象`本身`，就像这样：
```javascript
{
    '': 'baz' 
    // 空字符串表示源对象自身
}
```

`源对象`的映射源头`查找路径`还可以是一个在`源对象`中`不存在`的`路径`，这时候通过`查找路径`查找到的值为 ***undefined***，就像这样：
```javascript
const source = { baz: {} };

{
    'baz.bas.foo': 'das' 
    // 因为查找路径baz.bas.foo在源对象中不存在，故查找到的值是undefined
     
}
```

## 目标对象查找路径
`目标对象`的映射目的地`查找路径`可以是一个简单的`字符串`，代表一个单一的`对象属性`或者是代表一个对象指定属性的`查找路径`。就像这样：
```javascript
{
    'baz': 'bas' 
    // 可以是最简单的对象属性
}

{
    'baz': 'bas.foo[2].daz' 
    // 也可以是多个对象属性串联后的查找路径
}
```

`目标对象`的映射目的地`查找路径`也可以是一个`对象`，它不仅可以代表一个单一的`对象属性`或者是代表一个对象指定属性的`查找路径`，甚至还可以在其中配置`绑定指令`需要的`选项`。就像这样：
```javascript
{
    'baz': { key: 'foo' },
    'bas': { key: 'daz.das' }
}

{
    'baz': {
        key: 'foo.das?+!',
        default: 1,
        expand: () => [true]
        // 可以在其中配置绑定指令需要的选项
    }
}
```

`目标对象`的映射目的地`查找路径`还可以是一个`数组`，代表一个`源对象`的映射源头`查找路径`查找到的`值`，可以`同时映射`到`目标对象`的`多个查找路径`查找到的`目的地`上。就像这样：
```javascript
{
    'baz': [
        'bas.foo',
        { key: 'das.daz' },
        {  
            key: 'daf.foo?->!',
            default: () => 2,
            transform: (sval, tval, prop, host, tar) => 
                [sval, tval, '[status]', tar],
            increment: /^exclude/
        }
    ]
    // 源对象的映射源头查找路径查找的值，可以映射到多个目的地上
}
```

`目标对象`的映射目的地`查找路径`在`目标对象`中所查找到的所有`节点属性`，必须保证除了`最后一个节点属性`之外的其他`节点属性`，在`目标对象`中查找到的值是**Object**类型的对象且`不能`为**null**，否则将`跳过`当前的单次映射。就像这样：
```javascript
const mapper = new ObjectMapper({ 'a.b': ['b.c.d', 'b.e.f'] });

const result = mapper.appear({ 'a': { 'b': 5 } }, { 'b': { 'c': 9 } });
// result是{ b: { c: 9, e: { f: 5 } } }
```

## 对象映射
由于**ObjectMapper**类型提供了一个 **.appear**的`原型方法`，该类型的对象可以直接通过调用 **.appear**的方式进行`源对象`到`目标对象`的映射。值得一提的是，对象映射的状态接收方`目标对象`，它既可以是一个初始`无状态`的对象，同时也可以是一个初始`带有状态`的对象。

### ***.appear(source[, destination])***
- 参数`source`，必需，代表参与映射的`源对象`。
- 参数`destination`，可选，代表参与映射的`目标对象`，当不提供这个参数时，将默认`目标对象`是一个初始`无状态`的对象。
- 返回值是`destination`本身。
```javascript
const destination = { a: { b: 10 } };

const result1 = mapper.appear({ c: 5 });
// result1实际上就是默认在内部创建的一个初始无状态的对象

const result2 = mapper.appear({ c: 5 }, destination);
// result2实际上就是destination本身
```

## 映射替换策略
默认的映射`替换策略`是`保守的`，它不具有任何`攻击性`、`破坏性`和`侵略性`，不会去改变`目标对象`已经`存在`的某个状态。它只在保持`目标对象`原有状态的基础上，进行状态的`增量修改`。将这种策略作为默认的映射`替换策略`，这不一定是一个坏主意。
```javascript
const mapper = new ObjectMapper({ 'a.b': 'c.d' });

const result1 = mapper.appear({ a: { b: 2 } });
// result1是{ c: { d: 2 } }，目标查找路径在目标对象中不存在，根据默认的替换策略，可以进行增量修改

const result2 = mapper.appear({ a: { b: 2 } }, { c: { e: 4 } });
// result2是{ c: { e: 4, d: 2 } }，目标查找路径在目标对象中不存在，根据默认的替换策略，可以进行增量修改

const result3 = mapper.appear({ a: { b: 2 } }, { c: { d: 3 } });
// result3是{ c: { d: 3 } }，目标查找路径在目标对象中存在，根据默认的替换策略，需要跳过替换且保持目标对象原来的状态不变
```

## 绑定指令
实际工作中我们发现，在`对象映射`过程中通过某种手段去`干涉并改变`默认的`对象映射行为`是非常有用的。在最终改变`目标对象状态`之前，就尝试去做这些事情，为什么不可以呢？有两种方案放在我们面前，一种是通过**transform**回调函数的方式，直接在最终改变`目标对象状态`之前，就去调用它。另一种则是通过`组合`各种`基础指令`的方式，直接在最终改变`目标对象状态`之前，去执行这些指令。很明显第二种方案更符合我们的要求，它允许我们通过不同`基础指令`的`组合`方式，用最少的代码去改变`对象映射`过程。默认提供的`基础指令`有以下几种：

### *基础指令* **`?`**
这个`基础指令`主要去改变`查找路径`在`源对象`中查找到的`值`。如果当前指令接收到的`源对象值`是**null**或者是**undefined**，则指令会试图去用`目标对象查找路径`中配置的**default**项，替代原来的`源对象值`，否则`跳过`本次指令处理过程。
```javascript
const mapper = new ObjectMapper({ 
    'a': { key: 'b?', default: 4 },
    'c': [
        { key: 'd?', default: 5 }, 
        { 
            key: 'e?', 
            default: (tval, src, tar) => 6
        }
    ],
    'f.g': { key: 'h?', default: 7 }
});

const result = mapper.appear({ a: 1, c: null });
// result是{ b: 1, d: 5, e: 6, h: 7 }
```

### *基础指令* **`>`**
这个`基础指令`主要去改变`查找路径`在`源对象`中查找到的`值`。如果当前指令接收到的`源对象值`是**Object**类型的对象、**null**或者是**undefined**，并且接收到的`目标对象值`是**Object**类型的对象同时不为**null**，则指令会使用`源对象值`在`目标对象值`的基础上，进行状态的`增量合并`，否则`跳过`本次指令处理过程。还可以通过在`目标对象查找路径`中配置**increment**项来排除一些`源对象值`中的属性，被排除的属性将不参与本次合并。
```javascript
const mapper = new ObjectMapper({
    'a': 'b>',
    'c': [
        { key: 'd>!' },
        { key: 'e>!', increment: /^nam/ }
    ]
});

const result = mapper.appear({ a: 2, c: { f: 3, g: 4, name: 'liao' } }, { d: { f: 5, h: 6 }, e: { f: 5, h: 6 } });
// result是{ d: { f: 5, h: 6, g: 4, name: 'liao' }, e: { f: 5, h: 6, g: 4 }, b: 2 }
```

### *基础指令* **`*`**
这个`基础指令`主要去改变`查找路径`在`源对象`中查找到的`值`。如果当前指令接收到的`源对象值`是**Object**类型的对象、**null**或者是**undefined**，并且接收到的`目标对象值`是**Object**类型的对象同时不为**null**，则指令会使用`源对象值`在`目标对象值`的基础上，进行状态的`覆盖合并`，否则`跳过`本次指令处理过程。还可以通过在`目标对象查找路径`中配置**merge**项来排除一些`源对象值`中的属性，被排除的属性将不参与本次合并。
```javascript
const mapper = new ObjectMapper({
    'a': 'b*',
    'c': [
        { key: 'd*!' },
        { key: 'e*!', merge: /^nam/ }
    ]
});

const result = mapper.appear({ a: 2, c: { f: 3, g: 4, name: 'liao' } }, { d: { f: 5, h: 6 }, e: { f: 5, h: 6 } });
// result是{ d: { f: 3, h: 6, g: 4, name: 'liao' }, e: { f: 3, h: 6, g: 4 }, b: 2 }
```

### *基础指令* **`+`**
这个`基础指令`主要去改变`查找路径`在`源对象`中查找到的`值`。如果当前指令接收到的`目标对象值`是**Array**类型的对象，则指令会使用`源对象值`在`目标对象值`的基础上，在一定的`连接规则`下进行数组的连接，否则`跳过`本次指令处理过程。默认的数组`连接规则`规定，`源对象值`是在`目标对象值`的`尾部`，与其连接为一个新的数组。若你想`改变`默认的数组`连接规则`，可以在`目标对象查找路径`中配置**expand**项来改变`连接规则`。
```javascript
const mapper = new ObjectMapper({
    'a': ['b+', 'c+!'],
    'd': [
        'e+!', 
        {
             key: 'f+!',
             expand: (sval, tval, src, tar) => [true, 1]
             // 返回值[源对象值是否单独参与连接, 在目标对象值何处进行连接]
        }
    ]
});

const result = mapper.appear({ a: 2, d: [3, 4] }, { c: [1, 1], e: [2, 2], f: [5, 5] });
// result是{ c: [ 1, 1, 2 ], e: [ 2, 2, 3, 4 ], f: [ 5, [ 3, 4 ], 5 ], b: 2 }
```

### *基础指令* **`!`**
这个`基础指令`主要去改变`查找路径`在`目标对象`中查找到的`值`。如果当前指令接收到的`目标对象值`所在的`宿主对象`是一个**Object**类型的对象且不为**null**，则指令会使用`源对象值`去立即`更新目标对象`中的相应`状态`，否则`跳过`本次对`目标对象`的`状态更新`。该指令是对`默认映射替换策略`的一种互补，具有很强的`攻击性`、`破坏性`和`侵略性`，在使用之前应该清楚的知道正在做什么？
```javascript
const mapper = new ObjectMapper({
    'a': 'b',
    'c': ['d!', '!']
});

const result = mapper.appear({ a: 1, c: 4 }, { b: 2, d: 3 });
// result是{ b: 2, d: 4 }
```

### *基础指令* **`-`**
这个`基础指令`主要去改变`查找路径`在`源对象`中查找到的`值`、在`目标对象`中查找到的`值`、在`目标对象`中查找到的`宿主对象`和在`宿主对象`中`目标对象值`所对应的`属性`。可以通过在`目标对象查找路径`中配置**transform**项，来完全改变默认的`对象映射行为`。
```javascript
const mapper = new ObjectMapper({
    'a': [
        'b-',
        {
            key: '-+',
            transform: (sval, tval, prop, host, tar) =>
                [Array(sval).fill(3), [1], '[status]', tar]
        } 
    ]
});

const result = mapper.appear({ a: 2 });
// result是{ b: 2, '[status]': [1, 3, 3] }
```

### *组合基础指令* **`?->*+!`**
通过组合搭配`基础指令`的方式，去`干涉并改变`默认的`对象映射行为`是让人愉悦的。
```javascript
const mapper = new ObjectMapper({
    'a': [
        'b',
        {
            key: 'c.d?-+!',
            default: tval => Object.keys(tval).length ? 2 : 3,
            transform: (sval, tval, prop, host) => [
                Array(sval).fill(sval), 
                Array.isArray(tval) ? tval : [],
                prop,
                host
            ],
            expand: (_, tval) => tval.length ? 
                [true, Math.floor(tval.length / 2)] : [false]
        }
    ]
});

const destination = {};

mapper.appear({}, destination);
// destination是{ b: undefined, c: { d: [ 3, 3, 3 ] } }

mapper.appear({ a: null }, destination);
// destination是{ b: undefined, c: { d: [ 3, [2, 2], 3, 3 ] } }
```

## 未来的拓展
可以通过在**ObjectMapper**上调用**install**函数，`安装`其他的`自定义指令`插件。

### ***ObjectMapper.install(plugin)***
- 参数`plugin`，`必需`，表示插件本身，它会接受`ObjectMapper`作为参数。
- 返回值，`ObjectMapper`本身。
```javascript
function XXX_mapper(rt) {
    rt.presets.directives['X'] = handler;
};

ObjectMapper.install(XXX_mapper);
```

### ***handler(sval, tval, prop, host, fields, src, tar, index, ops)***
- 参数`sval`，表示当前指令`接收`到的`源对象值`。
- 参数`tval`，表示当前指令`接收`到的`目标对象值`。
- 参数`prop`，表示当前指令`接收`到的`目标对象值`，在`宿主对象`中对应的`属性`。
- 参数`host`，表示当前指令`接收`到的`目标对象值`所在的`宿主对象`。
- 参数`fields`，表示`目标对象查找路径`中的`单个配置选项`。
- 参数`src`，表示参与映射的`源对象`。
- 参数`tar`，表示参与映射的`目标对象`。
- 参数`index`，表示当前执行的`指令`在`指令集合`中的`索引`。
- 参数`ops`，表示当前需要执行的整个`指令集合`。
- 返回值，必须返回一个`数组`*[sval, tval, prop, host]*。

