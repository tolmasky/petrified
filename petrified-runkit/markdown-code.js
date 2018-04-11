const React = require("react");

const Highlighted = require("./highlighted");
const RunKit = require("./petrified-runkit");


module.exports = function code({ codeinfo, literal })
{
    const language = codeinfo && condeinfo[0];
    const sentinel = codeinfo && condeinfo[1];
    const isRunnable = sentinel === "runkit" && 
        RunKit.languages.has(language.toLowerCase());

    const children = [literal];
    const highlighted = isRunnable ?
        <RunKitWithOptions { ...{ codeinfo, children } } /> :
        <Highlighted { ...{ language, children } } />;        

    return <code>{ highlighted }</code>;
};

function RunKitWithOptions({ codeinfo, children })
{
    const { parse } = require("querystring");
    const args = parse(codeinfo.join("&"));
    const isTrueOrPresent = key => args[key] === "" || args[key] === "true";
    const options = 
    {
        mode: isTrueOrPresent("endpoint") ? "endpoint" : void(0),
        nodeVersion: args["node-version"] || args ["nodeVersion"] || void(0),
        getShareableURL: args["get-shareable-url"] || args["getShareableURL"] || false,
        evaluateOnLoad: isTrueOrPresent("autorun"),
        highlight: true
    };

    return <RunKit.Contents { ...options } children = { children } />;
}
