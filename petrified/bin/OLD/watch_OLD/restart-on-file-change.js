const process = require("@isomorphic/state-tree/process");

const { define } = require("@isomorphic/state-tree/state-tree");
const { base, getArguments: attrs } = require("generic-jsx");

const listen = require("@isomorphic/state-tree/listen");
const debounced = require("@isomorphic/state-tree/debounced");
const monitor = require("./monitor");



module.exports = define(restart =>
({
    "initial -> start": state =>
    {
        const { source, match } = attrs(state);
        const emitter = monitor({ source, match });

        return  <state status = "waiting-for-file-change">
                    <debounced  status = "autostart"
                                debounce = { 100 } 
                                ref = "monitor" >
                        <listen ref = "listener"
                                events = { ["change"] }
                                status = "autostart"
                                emitter = { emitter } />                    
                    </debounced>
                </state>;
    },

    "waiting-for-file-change -> #monitor.debouncing": (state, event) =>
    {
        console.log("cancel if necessary");

        return <state />;
    },

    "waiting-for-file-change -> #monitor.listening": (state, event) =>
    {
        console.log("would start now");

        return <state />;
    },

    "waiting-for-file-change -> /^#monitor:heard-\\d+$/": (state, event) =>
    {
        console.log("file changed!");

        return <state />;
    }
/*
    "monitoring -> restart": restart,
    "monitoring -> #monitoring.change": restart*/
}));

function restart(state)
{
    const { children:[restart, monitor] } = attrs(state);

    return  <state>
                { restart({ event: { name: "restart" } }) }
                <monitor/>
            </state>;
}
