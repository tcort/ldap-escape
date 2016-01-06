# ldap-escape

Escape functions for LDAP filters and distinguished names to prevent [LDAP injection](https://www.owasp.org/index.php/LDAP_injection) attacks.
Uses the escape codes from [Active Directory: Characters to Escape](http://social.technet.microsoft.com/wiki/contents/articles/5312.active-directory-characters-to-escape.aspx).

## Installation

    npm install --save ldap-escape

## Specification

### escapes for search filter

| Character | Escape |
|-----------|--------|
| `*`       | `\2A`  |
| `(`       | `\28`  |
| `)`       | `\29`  |
| `\`       | `\5C`  |
| `NUL`     | `\00`  |

### escapes for distinguished names

| Character                   | Escape |
|-----------------------------|--------|
| `,`                         | `\,`   |
| `\`                         | `\\`   |
| `#`                         | `\#`   |
| `+`                         | `\+`   |
| `<`                         | `\<`   |
| `>`                         | `\>`   |
| `;`                         | `\;`   |
| `"`                         | `\"`   |
| `=`                         | `\=`   |
| `SPC` (leading or trailing) | `\ `   |

## API

### ldapEscape.filter(format [, unsafe])

Parameters:

* `format` string with `${propertyName}` placeholder(s) where `propertyName` is the name of a property of `unsafe`
* `unsafe` an object containing values to escape and substitute in the format string.

Returns:

* safe string (when `unsafe` is supplied).
* function (when `unsafe` is not supplied).

### ldapEscape.dn(format [, unsafe])

Parameters:

* `format` string with `${propertyName}` placeholder(s) where `propertyName` is the name of a property of `unsafe`
* `unsafe` an object containing values to escape and substitute in the format string.

Returns:

* safe string (when `unsafe` is supplied).
* function (when `unsafe` is not supplied).

## Examples

### Escape a Search Filter

    "use strict";

    var ldapEscape = require('ldap-escape');

    var alice = {
        uid: 1337,
        cn: 'alice',
    };

    var safeFilter = ldapEscape.filter('(uid=${uid})', alice);
    console.log(safeFilter); // -> '(uid=1337)'

### Create a Function for Escaping Search Filters

    "use strict";

    var ldapEscape = require('ldap-escape');

    var alice = {
        uid: 1337,
        cn: 'alice',
    };

    var bob = {
        uid: 42,
        cn: 'bob',
    };

    var userEscape = ldapEscape.filter('(uid=${uid})');

    var safeFilter = userEscape(alice);
    console.log(safeFilter); // -> '(uid=1337)'

    safeFilter = userEscape(bob);
    console.log(safeFilter); // -> '(uid=42)'

### Escape a DN

    "use strict";

    var ldapEscape = require('ldap-escape');

    var alice = {
        uid: 1337,
        cn: 'alice',
    };

    var safeDn = ldapEscape.dn('cn=${cn},dc=test', alice);
    console.log(safeDn); // -> 'cn=alice,dc=test'

### Create a Function for Escaping DNs

    "use strict";

    var ldapEscape = require('ldap-escape');

    var alice = {
        uid: 1337,
        cn: 'alice',
    };

    var bob = {
        uid: 42,
        cn: 'bob',
    };

    var dnEscape = ldapEscape.dn('cn=${cn},dc=test');

    var safeDn = dnEscape(alice);
    console.log(safeDn); // -> 'cn=alice,dc=test'

    safeDn = dnEscape(bob);
    console.log(safeDn); // -> 'cn=bob,dc=test'

## Testing

    npm test

## License

See [LICENSE.md](https://github.com/tcort/ldap-escape/blob/master/LICENSE.md)
