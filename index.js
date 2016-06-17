/**
 * Copyright (C) 2016 yanni4night.com
 * index.js
 *
 * changelog
 * 2016-06-14[00:58:59]:revised
 * 2016-06-16[12:04:42]:sourceType=module
 *
 * @author yanni4night@gmail.com
 * @version 0.1.1
 * @since 0.1.0
 */
'use strict';
const path = require('path');
const fs = require('fs');
const esprima = require('esprima');
const extend = require('lodash/extend');
const isFunction = require('lodash/isFunction');
const logger = require('antiaris-logger');

exports.transform = (code, opts, cb) => {
    const options = extend({}, opts);

    try {
        const ast = esprima.parse(code, {
            range: true,
            tolerant: true,
            sourceType: 'module'
        });

        let deps = [];

        JSON.stringify(ast, (key, value) => {
            if (value && 'CallExpression' === value.type && value.callee && 'require' === value.callee.name &&
                Array.isArray(value.arguments)) {
                if (value.arguments.length !== 1 || 'Literal' !== value.arguments[0].type) {
                    let expression = code.slice(value.range[0], value.range[1]);
                    logger.warn(`Dynamic require is not supported: "${expression}"` + (options.filename ?
                        ` in ${options.filename}` : ''));
                } else {
                    deps.push(value.arguments[0]);
                }


            }

            return value;
        });

        let finalCode = code;

        if (isFunction(options.translateDep)) {
            for (let i = deps.length - 1; i >= 0; --i) {
                let dep = deps[i];

                //Fixed './' to './index'
                if ('/' === dep.value[dep.value.length - 1]) {
                    dep.value = dep.value + 'index';
                }

                let newId = options.translateDep(dep.value);
                if (newId) {
                    finalCode = finalCode.slice(0, dep.range[0]) + "'" + newId + "'" + finalCode.slice(dep.range[1]);
                }
                dep.value = newId;
            }
        }

        deps = deps.filter(dep => !!dep.value);

        const depsModules = deps.map(dep =>
            ` '${dep.value}'`).join().slice(1);
        const backCode = finalCode.replace(/\n/mg, '\n    ');

        const moduleId = options.moduleId ? (isFunction(options.moduleId) ? options.moduleId() : options.moduleId) :
            options.filename;

        finalCode =
            `System.registerDynamic('${options.moduleId}', [${depsModules}], true, function(require, exports, module) {
    var define, global = this, GLOBAL = this;

    ${backCode}

    return module.exports;
});`;

        cb(null, {
            code: finalCode,
            deps: deps.map(dep => dep.value)
        });
    } catch (err) {
        cb(err);
    }
};

exports.transformFile = (file, opts, cb) => {
    fs.readFile(file, 'utf8', (err, content) => {
        if (err) {
            cb(err);
        } else {
            exports.transform(content, extend({}, opts, {
                filename: path.basename(file)
            }), cb);
        }
    });
};