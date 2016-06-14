# antiaris-transform-commonjs-modules-systemjs
[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency status][david-dm-image]][david-dm-url] [![Dev Dependency status][david-dm-dev-image]][david-dm-dev-url]

CommonJS 风格模块转换为 [System.register](https://github.com/systemjs/systemjs/blob/master/docs/system-api.md#systemregisterdynamicname--deps-executingrequire-declare) 风格。


```js
import {transform, transformFile} from 'antiaris-transform-commonjs-modules-systemjs';

transform('require("./bar.js");\nmodule.exports = 43;', {
    moduleId: 'foo',
    translateDep: function(dep) {
        return path.basename(dep, '.js');
    }
}, function(err, result) {
    console.log(result.code);
    /*System.registerDynamic('foo', ['bar'], true, function(require, exports, module) {
    var define, global = this, GLOBAL = this;

    require('bar');
    module.exports = 43;

    return module.exports;
    });*/
});

```


[npm-url]: https://npmjs.org/package/antiaris-transform-commonjs-modules-systemjs
[downloads-image]: http://img.shields.io/npm/dm/antiaris-transform-commonjs-modules-systemjs.svg
[npm-image]: http://img.shields.io/npm/v/antiaris-transform-commonjs-modules-systemjs.svg
[travis-url]: https://travis-ci.org/antiaris/antiaris-transform-commonjs-modules-systemjs
[travis-image]: http://img.shields.io/travis/antiaris/antiaris-transform-commonjs-modules-systemjs.svg
[david-dm-url]:https://david-dm.org/antiaris/antiaris-transform-commonjs-modules-systemjs
[david-dm-image]:https://david-dm.org/antiaris/antiaris-transform-commonjs-modules-systemjs.svg
[david-dm-dev-url]:https://david-dm.org/antiaris/antiaris-transform-commonjs-modules-systemjs#info=devDependencies
[david-dm-dev-image]:https://david-dm.org/antiaris/antiaris-transform-commonjs-modules-systemjs/dev-status.svg