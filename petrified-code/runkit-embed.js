const React = require("react");
const { parse } = require("querystring");

const RunKitAble = new Set(["javascript", "js", "jsx"]);


module.exports = function (codeinfo)
{
    const [language, sentinel] = [].concat(codeinfo);
    const isRunKitAble = RunKitAble.has(language) && sentinel === "runkit";

    if (!isRunKitAble)
        return null;

    const args = parse(codeinfo.join("&"));
    const endpoint = args.endpoint === "" || args.endpoint === "true";
    const mode = endpoint ? "endpoint" : void(0);
    const nodeVersion = args["node-version"] || args ["nodeVersion"] || void(0);
    const getShareableURL = args["get-shareable-url"] || args["getShareableURL"] || false;
    const autorun = args.autorun === "" || args.autorun === "true";
    const configuration = { mode, nodeVersion };

    return  <script dangerouslySetInnerHTML = { { __html:`
            var tag = document.currentScript || (function (scripts)
            {
                return scripts[scripts.length - 1];
            })(document.getElementsByTagName("script"));
            var target = tag.previousSibling;
            var configuration = ${JSON.stringify(configuration)};

            configuration.element = target;
            configuration.source = RunKit.sourceFromElement(target);
            configuration.clearParentContents = true;

            configuration.onLoad = function()
            {
                ${getShareableURL && `notebook.getShareableURL(${getShareableURL});` }

                if (${autorun})
                    notebook.evaluate();
            }
            var notebook = RunKit.createNotebook(configuration);
            `} } />;
}
