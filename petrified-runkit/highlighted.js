const React = require("react");
const { css } = require("emotion");

var CodeMirror;


module.exports = function Highlighted({ mode, language, children  })
{
    const className = [
        "CodeMirror",
        "CodeMirror-lines",
        "theme-border-color",
        "theme-border-radius",
        styles()
    ].join(" ");
    
    const calculatedMode = mode || findMode(language);
    const code = [].concat(children)[0];
    
    return  <div className = "cm-s-runkit-light" >
                <div className = { className } >
                    { highlightContents(calculatedMode, code) }
                </div>
            </div>;
};

function styles()
{
    return css`
        counter-reset:li; /* Initiate a counter */
        border-width: 1px;
        border-style: solid;

        & > div
        {
            position:relative; /* Create a positioning context */
            margin:0; /* Give each list item a left margin to make room for the numbers */
        }

        & > div > .CodeMirror-gutter-wrapper
        {
            position: absolute;
            left: -36px;
        }

        & > div.empty:after
        {
            content: "\\00a0";
        }

        span.CodeMirror-linenumber:before
        {
            content:counter(li) " "; /* Use the counter as content */
            counter-increment:li; /* Increment the counter by 1 */
    
            /* Position and style the number */
            position:absolute;
            top: 0;
            box-sizing:border-box;
            width: 36px;
            text-align: right;
            user-select: none;
        }`;
}

function highlightContents(mode, contents)
{
    const CodeMirror = getCodeMirror();
    const linenumber =
        <div className = "CodeMirror-gutter-wrapper">
            <span className = "CodeMirror-linenumber" />
        </div>;
    const result = [[linenumber]];

    CodeMirror.runMode(contents, mode, function (text, style, _line_, _start_)
    {
        // We don't want to start a new line if we'll be finishing.
        if (text === "\n")
            return result.push([linenumber, text]);
        
        const current = result[result.length - 1];

        if (!style)
            return current.push(text);

        const className = style.replace(/([^\s]+)\s*/g, name => `cm-${name}`);
        const token = <span className = { className } >{ text }</span>;

        current.push(token);
    });
    const props = (children, key) => (
    {
        key,
        className: children.length > 2 ? "" : "empty",
    });

    return result.map((children, key) =>
        React.createElement("div", props(children, key), children));
}

function findMode(language)
{
    const CodeMirror = getCodeMirror();
    const name = language.toLowerCase();
    const compare = check => check.toLowerCase() === name;
    const info = CodeMirror.modeInfo
        .find(info =>
            compare(info.mode) || (info.alias || []).findIndex(compare) > -1);

    return info && info.mode;
}

function getCodeMirror()
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

