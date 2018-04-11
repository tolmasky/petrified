const React = require("react");
const { css } = require("emotion");
const linenumber =
    <div className = "CodeMirror-gutter-wrapper">
        <span className = "CodeMirror-linenumber" />
    </div>;


module.exports = function code({ codeinfo, literal })
{
    if (!codeinfo)
        return <code>{ literal }</code>;
    
    const mode = findMode(codeinfo[0]);

    if (!mode)
        return <code>{ literal }</code>;
    
    const className = [
        "CodeMirror",
        "CodeMirror-lines",
        "theme-border-color",
        "theme-border-radius",
        styles()
    ].join(" ");

    return  <code className = "cm-s-runkit-light" >
                <div className = { className } >
                    { highlightContents(mode, literal) }
                </div>
            </code>;
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
    const result = [[linenumber]];

    CodeMirror.runMode(contents, mode, function (text, style, _line_, _start_)
    {
        // We don't want to start a new line if we'll be finishing.
        if (text === "\n")
            return result.push([linenumber]);
        
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
        className: children.length > 1 ? "" : "empty",
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
    const CodeMirror = require("codemirror/addon/runmode/runmode.node.js");
    const meta = require("codemirror/mode/meta.js");

    CodeMirror.modeInfo.forEach(info => 
        info.mode && info.mode !== "null" &&
        require("codemirror/mode/" + info.mode + "/" + info.mode + ".js"));
    
    return CodeMirror;
}
