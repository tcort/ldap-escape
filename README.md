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

### ldapEscape.filter(format, unsafe)

Parameters:

* `format` string with `${propertyName}` placeholder(s) where `propertyName` is the name of a property of `unsafe`
* `unsafe` an object containing values to escape and substitute in the format string.

Returns:

* safe string (when `unsafe` is supplied).
* function (when `unsafe` is not supplied).

### ldapEscape.dn(format, unsafe)

Parameters:

* `format` string with `${propertyName}` placeholder(s) where `propertyName` is the name of a property of `unsafe`
* `unsafe` an object containing values to escape and substitute in the format string.

Returns:

* safe string (when `unsafe` is supplied).
* function (when `unsafe` is not supplied).

## Example

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

    var safeFilter = ldapEscape.filter('(uid=${uid})', alice);
    // -> (uid=1337)

    var userEscape = ldapEscape.filter('(uid=${uid})');
    safeFilter = userEscape(alice);
    // -> (uid=1337)

    safeFilter = userEscape(bob);
    // -> (uid=42)

    var safeDn = ldapEscape.dn('cn=${cn},dc=test', alice);
    // -> cn=alice,dc=test

## Testing

    npm test

## License

```
Copyright (c) 2015 Thomas Cort <linuxgeek@gmail.com>

Permission to use, copy, modify, and distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```
