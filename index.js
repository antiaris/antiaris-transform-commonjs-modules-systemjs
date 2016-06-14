/**
 * Copyright (C) 2016 yanni4night.com
 * index.js
 *
 * changelog
 * 2016-06-14[00:58:59]:revised
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */
'use strict';
const babylon = require('babylon');
const path = require('path');
const fs = require('fs');
const extend = require('lodash/extend');
const isFunction = require('lodash/isFunction');

exports.transform = (code, opts, cb) => {
    const options = extend({}, opts);

    try {
        const ast = babylon.parse(code, {
            sourceType: 'module'
        });

        const deps = [];

        JSON.stringify(ast, (key, value) => {
            if (value && 'CallExpression' === value.type && value.callee && 'require' === value.callee.name &&
                Array.isArray(value.arguments)) {
                if (value.arguments.length !== 1) {
                    let args = value.arguments.map(a => a.value).join('');
                    throw new Error(`"require(${args})" is illegal`);
                }
                deps.push(value.arguments[0]);
            }

            return value;
        });

        let finalCode = code;

        if (isFunction(options.translateDep)) {
            for (let i = deps.length - 1; i >= 0; --i) {
                let dep = deps[i];
                let newId = options.translateDep(dep.value);
                finalCode = finalCode.slice(0, dep.start) + "'" + newId + "'" + finalCode.slice(dep.end);
                dep.value = newId;
            }
        }

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
            deps: deps
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