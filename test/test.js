/**
 * Copyright (C) 2016 yanni4night.com
 * test.js
 *
 * changelog
 * 2016-06-14[01:10:43]:revised
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */
const assert = require('assert');
const c2s = require('../');
const fs = require('fs');
const System = require('systemjs');
const path = require('path');

global.System = System;

describe('transform', function () {
    describe('exports', function () {
        it('should import the right exports', function (done) {

            const translateDep = function (dep) {

                let ext = path.extname(dep);
                if (ext) {
                    dep = dep.slice(0, -ext.length);
                }
                return path.relative(path.join(__dirname, '..'), path.join(
                    __dirname, 'fixtures', dep));
            };

            const files = 'foo,bar,es6'.split(',');

            const tasks = files.map(function (file) {
                return new Promise(function (resolve, reject) {
                    c2s.transformFile(__dirname + `/fixtures/${file}.js`, {
                        moduleId: `test/fixtures/${file}`,
                        translateDep: translateDep
                    }, function (err, result) {
                        assert.equal(err, null);
                        fs.writeFile(__dirname + `/output/${file}.js`,
                            result.code,
                            function () {
                                resolve();
                            })
                    });
                });
            });

            Promise.all(tasks).then(function () {
                require(__dirname + '/output/foo.js');
                require(__dirname + '/output/bar.js');

                System.import('test/fixtures/foo').then(function (foo) {
                    assert.deepEqual(foo.foo, 45);
                    assert.deepEqual(foo.bar, 'bar');
                    assert.ok(!foo.hasOwnProperty('name'));
                }).then(function () {
                    done();
                }, function (e) {
                    console.error(e);
                });
            });

        });
    });
});