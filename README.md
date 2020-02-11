# ldap-escape

Template literal tag functions for LDAP filters and distinguished names to prevent [LDAP injection](https://www.owasp.org/index.php/LDAP_injection) attacks.
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

## Template Literal Tag Functions

### ldapEscape.filter

Escapes input for use as an LDAP filter.

### ldapEscape.dn

Escapes input for use as an LDAP distinguished name.

## Examples

### Escape a Search Filter

    "use strict";

    const ldapEscape = require('ldap-escape');

    const uid = 1337;

    console.log(ldapEscape.filter`uid=${uid}`); // -> 'uid=1337'

### Escape a DN

    "use strict";

    const ldapEscape = require('ldap-escape');

    const cn = 'alice';

    console.log(ldapEscape.dn`cn=${cn},dc=test`); // -> 'cn=alice,dc=test'

## Testing

    npm test

## License

See [LICENSE.md](https://github.com/tcort/ldap-escape/blob/master/LICENSE.md)
