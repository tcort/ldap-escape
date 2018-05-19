'use strict';

const replacements = {

    /* search filter replacements */

    filter: {
        '\u0000': '\\00', // NUL
        '\u0028': '\\28', // (
        '\u0029': '\\29', // )
        '\u002a': '\\2a', // *
        '\u005c': '\\5c'  // \
    },

    /* distinguished name replacements */

    dnBegin: {
        '\u0020': '\\ ', // SPC
    },
    dn: {
        '\u0022': '\\"', // "
        '\u0023': '\\#', // #
        '\u002b': '\\+', // +
        '\u002c': '\\,', // ,
        '\u003b': '\\;', // ;
        '\u003c': '\\<', // <
        '\u003d': '\\=', // =
        '\u003e': '\\>', // >
        '\u005c': '\\\\' // \
    },
    dnEnd: {
        '\u0020': '\\ ' // SPC
    }

};

module.exports = {

    filter: function filter(strings, ...values) {
        let safe = '';
        strings.forEach((string, i) => {
            safe += string;
            if (values.length > i) {
                safe += `${values[i]}`.replace(/(\u0000|\u0028|\u0029|\u002a|\u005c)/gm, (ch) => replacements.filter[ch]);
            }
        });
        return safe;
    },

    dn: function dn(strings, ...values) {
        let safe = '';
        strings.forEach((string, i) => {
            safe += string;
            if (values.length > i) {
                safe += `${values[i]}`
                    .replace(/(\u0022|\u0023|\u002b|\u002c|\u003b|\u003c|\u003d|\u003e|\u005c)/gm, (ch) => replacements.dn[ch])
                    .replace(/^(\u0020)/gm, (ch) => replacements.dnBegin[ch])
                    .replace(/(\u0020)$/gm, (ch) => replacements.dnEnd[ch]);

            }
        });
        return safe;
    },


};
