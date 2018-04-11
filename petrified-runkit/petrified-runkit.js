const React = require("react");
const { css } = require("emotion");

const Highlighted = require("./highlighted");


module.exports = function RunKit(props)
{
    const { highlight = true, children, style, className, ...rest } = props;
    const highlighted = highlight ?
        <Highlighted { ... { ...rest, mode: "jsx", children } } /> :
        children;

    const height = integer(style, "height", -30);
    const minHeight = integer(style, "minHeight");

    return  <div style = { style } className = { className } >
                <div>{ children }</div>
                <RunKitEmbedPreviousNode { ... { height, minHeight, ...rest } } />
            </div>;
};

function integer(style, key, d = 0)
{
    const string = style[key];
    const number = parseInt(string, 10);

    if (number !== number)
        return undefined;

    return number + d;
}

module.exports.languages = new Set(["js", "javascript", "jsx", "node"]);

function RunKitEmbedPreviousNode(props)
{console.log(props);
    const getShareableURL = props.getShareableURL;
    const evaluateOnLoad = props.evaluateOnLoad;

    return <script dangerouslySetInnerHTML = { { __html:`
        var tag = document.currentScript || (function (scripts)
        {
            return scripts[scripts.length - 1];
        })(document.getElementsByTagName("script"));
        var target = tag.previousSibling;
        var configuration = ${JSON.stringify(props)};

        configuration.element = target;
        configuration.source = RunKit.sourceFromElement(target);
        configuration.clearParentContents = true;
        configuration.onLoad = function()
        {
            ${getShareableURL && `notebook.getShareableURL(${getShareableURL});` }
            ${evaluateOnLoad && `notebook.evaluate();`}
        }
        var notebook = RunKit.createNotebook(configuration);
        `} } />;
}
