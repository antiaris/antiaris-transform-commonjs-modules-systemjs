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

global.System = System;

describe('transform', function () {
    describe('exports', function () {
        it('should import the right exports', function (done) {
            c2s.transformFile(__dirname + '/fixtures/foo.js', {}, function (err, result) {
                assert.equal(err, null);
                fs.writeFile(__dirname + '/output/foo.js', result.code, function () {
                    require(__dirname + '/output/foo.js');
                    System.import('foo.js').then(function (foo) {
                        assert.deepEqual(foo.foo, 45);
                        assert.ok(!foo.hasOwnProperty('name'));
                    }).then(function () {
                        done();
                    }, function (e) {
                        console.error(e);
                        done();
                    });
                })
            });
        });
    });
});