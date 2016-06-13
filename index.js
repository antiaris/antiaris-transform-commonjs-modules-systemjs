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
const fs = require('fs');

exports.transform = (code, cb) => {
    try {
        let ast = babylon.parse(code,{
            sourceType: 'module'
        });

        JSON.stringify(ast, (key, value) => {
            if (value && 'CallExpression' === value.type && value.callee && 'require' === value.callee.name && Array.isArray(value.arguments)) {
                if (value.arguments.length !== 1) {
                    let args = value.arguments.map(a => a.value).join('');
                    throw new Error(`"require(${args})" is illegal`);
                }
                console.log('require("' + value.arguments[0].value + '")');
            }

            return value;
        });
        cb(null, ast);
    } catch (err) {
        cb(err);
    }
};

exports.transformFile = (file, cb) => {
    fs.readFile(file, 'utf8', (err, content) => {
        if (err) {
            cb(err);
        } else {
            exports.transform(content, cb);
        }
    });
};