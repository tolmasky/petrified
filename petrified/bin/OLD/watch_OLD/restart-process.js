const process = require("@isomorphic/state-tree/process");
const listen = require("@isomorphic/state-tree/listen");
const { define } = require("@isomorphic/state-tree/state-tree");
const { base, getArguments: attrs } = require("generic-jsx");
const monitor = require("./monitor");



module.exports = define(restart =>
({
    "initial -> start": start,

    "/^waiting|initial$/ -> restart": (state, event) =>
        debounce(<state initiated = { event.timestamp } >),

    "debounce -> restart": (state, event) =>
        <state initiated = { event.timestamp } >,

    "debounce -> #timer.finished": debounce,

    "running -> restart": (state, event, update) =>
    {
        const { children:[process] } = attrs(state);

        return  <state status = "killing" initiated = { event.timestamp } >
                    { update(process, { name:"kill" }) }
                </state>;
    },
    
    "running -> #process.finished": state =>
        <state status = "waiting" children = {[]} />,

    "killing -> restart": (state, event) =>
        <state initiated = { event.timestamp } >

    "killing -> #process.finished": debounce,

    "waiting -> kill": "finished",

    "killing -> kill": "killing-then-finish",
    "killing-then-finish -> #process.finished": "finished",

    "initial -> kill": "finished",
    
    "debounce -> kill": (state, event)
    {
        const { children:[timer] } = attrs(state);

        update(timer, {name:"finished"});

        return  <state>
                    
                </state>
    }

}));

function debounce(state, event)
{
    const { initiated, debounce } = attrs(state);
    const remaining = debounce - (event.timestamp - initiated);
    
    if (remaining <= 0)
        return start(<state children = {[]} />);

    return  <state status = "debounce" >
                <timer  ref = "timer"
                        status = "autostart"
                        delay = { remaining } />
            </state>;
}

function start(state)
{
    const { execute } = attrs(state);

    return  <state status = "running">
                <process    ref = "process"
                            status = "autostart"
                            execute = { execute } />
            </state>;
}
