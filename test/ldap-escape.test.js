'use strict';

var ldapEscape = require('../index');
var expect = require('expect.js');

describe('ldap-escape', function () {
    describe('.filter(format, unsafe)', function () {
        it('should work in the base case (no escaping), returning a string', function () {
            expect(ldapEscape.filter('(uid=${uid})', { uid: 1337 })).to.be('(uid=1337)');
        });
        it('should work in the base case (no escaping), returning a function', function () {
            var escaper = ldapEscape.filter('(uid=${uid})');
            expect(escaper({ uid: 1337 })).to.be('(uid=1337)');
        });
        it('should correctly escape the OWASP Christmas Tree Example', function () {
            expect(ldapEscape.filter('(test=${test})', { test: 'Hi (This) = is * a \\ test # ç à ô' })).to.be('(test=Hi \\28This\\29 = is \\2a a \\5c test # ç à ô)');
        });
        it('should correctly escape the PHP test case', function () {
            expect(ldapEscape.filter('${test}', { test: 'foo=bar(baz)*' })).to.be('foo=bar\\28baz\\29\\2a');
        });
    });
    describe('.dn(format, unsafe)', function () {
        it('should work in the base case (no escaping), returning a string', function () {
            expect(ldapEscape.dn('cn=${cn},dc=${dc}', { cn: 'alice', dc: 'com' })).to.be('cn=alice,dc=com');
        });
        it('should work in the base case (no escaping), returning a function', function () {
            var escaper = ldapEscape.dn('cn=${cn},dc=${dc}');
            expect(escaper({ cn: 'alice', dc: 'com' })).to.be('cn=alice,dc=com');
        });
        it('should escape a leading space', function () {
            expect(ldapEscape.dn('cn=${cn},dc=${dc}', { cn: ' alice', dc: 'com' })).to.be('cn=\\ alice,dc=com');
        });
        it('should escape a leading hash', function () {
            expect(ldapEscape.dn('cn=${cn},dc=${dc}', { cn: '#alice', dc: 'com' })).to.be('cn=\\#alice,dc=com');
        });
        it('should escape a leading hash and trailing space', function () {
            expect(ldapEscape.dn('cn=${cn},dc=${dc}', { cn: '# ', dc: 'com' })).to.be('cn=\\#\\ ,dc=com');
        });
        it('should escape a trailing space', function () {
            expect(ldapEscape.dn('cn=${cn},dc=${dc}', { cn: 'alice ', dc: 'com' })).to.be('cn=alice\\ ,dc=com');
        });
        it('should escape a dn of just 3 spaces', function () {
            expect(ldapEscape.dn('cn=${cn},dc=${dc}', { cn: '   ', dc: 'com' })).to.be('cn=\\  \\ ,dc=com');
        });
        it('should correctly escape the OWASP Christmas Tree Example', function () {
            expect(ldapEscape.dn('${dn}', { dn: ' Hello\\ + , "World" ; ' })).to.be('\\ Hello\\\\ \\+ \\, \\\"World\\\" \\;\\ ');
        });
        it('should correctly escape the Active Directory Examples', function () {
            expect(ldapEscape.dn('cn=${cn},ou=West,dc=MyDomain,dc=com', { cn: 'Smith, James K.' })).to.be('cn=Smith\\, James K.,ou=West,dc=MyDomain,dc=com');
            expect(ldapEscape.dn('ou=${ou},dc=MyDomain,dc=com', { ou: 'Sales\\Engineering' })).to.be('ou=Sales\\\\Engineering,dc=MyDomain,dc=com');
            expect(ldapEscape.dn('cn=${cn},ou=West,dc=MyDomain,dc=com', { cn: 'East#Test + Lab' })).to.be('cn=East\\#Test \\+ Lab,ou=West,dc=MyDomain,dc=com');
            expect(ldapEscape.dn('cn=${cn},ou=West,dc=MyDomain,dc=com', { cn: ' Jim Smith ' })).to.be('cn=\\ Jim Smith\\ ,ou=West,dc=MyDomain,dc=com');
        });
    });
});
