'use strict';

var ldapEscape = require('../index');

describe('ldap-escape', function () {
    describe('.filter', function () {
        it('should work in the base case (no escaping), returning a string', function () {
            const uid = 1337;
            expect(ldapEscape.filter`(uid=${uid})`).toBe('(uid=1337)');
        });
        it('should correctly escape the OWASP Christmas Tree Example', function () {
            const test = 'Hi (This) = is * a \\ test # ç à ô';
            expect(ldapEscape.filter`(test=${test})`).toBe('(test=Hi \\28This\\29 = is \\2a a \\5c test # ç à ô)');
        });
        it('should correctly escape the PHP test case', function () {
            const test = 'foo=bar(baz)*';
            expect(ldapEscape.filter`${test}`).toBe('foo=bar\\28baz\\29\\2a');
        });
    });
    describe('.dn', function () {
        it('should work in the base case (no escaping), returning a string', function () {
            const cn = 'alice';
            const dc = 'com';
            expect(ldapEscape.dn`cn=${cn},dc=${dc}`).toBe('cn=alice,dc=com');
        });
        it('should escape a leading space', function () {
            const cn = ' alice';
            const dc = 'com';
            expect(ldapEscape.dn`cn=${cn},dc=${dc}`).toBe('cn=\\ alice,dc=com');
        });
        it('should escape a leading hash', function () {
            const cn = '#alice';
            const dc = 'com';
            expect(ldapEscape.dn`cn=${cn},dc=${dc}`).toBe('cn=\\#alice,dc=com');
        });
        it('should escape a leading hash and trailing space', function () {
            const cn = '# ';
            const dc = 'com';
            expect(ldapEscape.dn`cn=${cn},dc=${dc}`).toBe('cn=\\#\\ ,dc=com');
        });
        it('should escape a trailing space', function () {
            const cn = 'alice ';
            const dc = 'com';
            expect(ldapEscape.dn`cn=${cn},dc=${dc}`).toBe('cn=alice\\ ,dc=com');
        });
        it('should escape a dn of just 3 spaces', function () {
            const cn = '   ';
            const dc = 'com';
            expect(ldapEscape.dn`cn=${cn},dc=${dc}`).toBe('cn=\\  \\ ,dc=com');
        });
        it('should correctly escape the OWASP Christmas Tree Example', function () {
            const dn = ' Hello\\ + , "World" ; ';
            expect(ldapEscape.dn`${dn}`).toBe('\\ Hello\\\\ \\+ \\, \\\"World\\\" \\;\\ ');
        });
        it('should correctly escape the Active Directory Examples', function () {
            let cn, ou;

            cn = 'Smith, James K.';
            expect(ldapEscape.dn`cn=${cn},ou=West,dc=MyDomain,dc=com`).toBe('cn=Smith\\, James K.,ou=West,dc=MyDomain,dc=com');

            ou = 'Sales\\Engineering';
            expect(ldapEscape.dn`ou=${ou},dc=MyDomain,dc=com`).toBe('ou=Sales\\\\Engineering,dc=MyDomain,dc=com');

            cn = 'East#Test + Lab';
            expect(ldapEscape.dn`cn=${cn},ou=West,dc=MyDomain,dc=com`).toBe('cn=East\\#Test \\+ Lab,ou=West,dc=MyDomain,dc=com');

            cn = ' Jim Smith ';
            expect(ldapEscape.dn`cn=${cn},ou=West,dc=MyDomain,dc=com`).toBe('cn=\\ Jim Smith\\ ,ou=West,dc=MyDomain,dc=com');
        });
    });
});
