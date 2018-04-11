var CodeMirror;

module.exports = function getCodeMirror()
{
    if (CodeMirror)
        return CodeMirror;

    CodeMirror = require("codemirror/addon/runmode/runmode.node.js");

    const meta = require("codemirror/mode/meta.js");

    CodeMirror.modeInfo.forEach(info => 
        info.mode && info.mode !== "null" &&
        require("codemirror/mode/" + info.mode + "/" + info.mode + ".js"));
    
    return CodeMirror;
}
