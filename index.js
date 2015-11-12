'use strict';

var _ = require('lodash');

var replacements = {

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

    filter: function escapeFilter(format, unsafe) {
        var formatter = _.template(format, {
            interpolate: /\$\{([^\}]+)\}/gm
        });

        function escapeFilterClosure(unsafe) {
            return formatter(_.transform(unsafe, function doEscape(safe, val, key) {
                safe[key] = ('' + val).replace(/(\u0000|\u0028|\u0029|\u002a|\u005c)/gm, function doReplace(str) {
                    return replacements.filter[str];
                });
            }));
        }

        return (arguments.length === 1) ? escapeFilterClosure : escapeFilterClosure(unsafe);
    },

    dn: function escapeDn(format, unsafe) {
        var formatter = _.template(format, {
            interpolate: /\$\{([^\}]+)\}/gm
        });

        function escapeDnClosure(unsafe) {
            return formatter(_.transform(unsafe, function doEscape(safe, val, key) {
                safe[key] = ('' + val).replace(/(\u0022|\u0023|\u002b|\u002c|\u003b|\u003c|\u003d|\u003e|\u005c)/gm, function doReplace(str) {
                    return replacements.dn[str];
                });

                safe[key] = safe[key].replace(/^(\u0020)/gm, function doReplace(str) {
                    return replacements.dnBegin[str];
                });

                safe[key] = safe[key].replace(/(\u0020)$/gm, function doReplace(str) {
                    return replacements.dnEnd[str];
                });
            }));
        }

        return (arguments.length === 1) ? escapeDnClosure : escapeDnClosure(unsafe);
    }
};
