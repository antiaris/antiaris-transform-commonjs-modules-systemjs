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

describe('transform', function() {
    describe('transform', function() {
        it('should', function(done) {
            c2s.transformFile(__dirname + '/foo.txt', function(err, ast) {
                assert.equal(err, null);

                require('fs').writeFileSync('ast.json', JSON.stringify(ast, null, 2));
                done();
            });
        });
    });
});