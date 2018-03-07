
module.exports = function sass()
{console.log(arguments);
    return require("isomorphic-sass").apply(this, arguments);
}

module.exports.extensions = new Set(["sass"]);
