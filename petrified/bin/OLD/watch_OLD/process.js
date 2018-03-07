
const { spawn } = require("child_process");
const { promisify } = require("util");
const pstree = promisify(require("ps-tree"));
const kill = ({ pid }) => pstree(emitter.pid)
    .then(children => children.map(({ PID }) => PID))
    .then(children => ["-s", "SIGINT", pid, ...children])
    .then(args => spawn("kill", children));

const effect = require("@isomorphic/effects/effect");

//const { define, impossible } = require("./state-tree");
//const { getArguments: attrs } = require("generic-jsx");

const { define, impossible } = require("@isomorphic/effects/define");
const { attrs } = require("@isomorphic/effects/generic-jsx");

module.exports = define(process =>
({
    "initial -> start": state =>
    {
        console.log("starting");
        return  <state status = "starting" >
                    <effect ref = "process" start = { start(state) } />
                </state>
    },

    "starting -> #process.started": (state, { data }) =>
        <state status = "running" pid = { data.pid } />,

    "starting -> kill": state =>
        <state status = "kill-when-started" />,

    "starting -> #process.exited": impossible,

    "kill-when-started -> started": (state, { data }) =>
        toKilling(<state pid = { data.pid } />),

    "kill-when-started -> #process.exit": "finished",

    "killing -> #process.exit": "finished",

    "running -> kill": toKilling,

    "running -> #process.exit": "finished",

    "finished": { }
}));

function start(state)
{
    const { execute } = attrs(state);

    return function (push)
    {
        const emitter = execute();
        const { pid } = emitter;
        const state = { exited: false, started: false };

        emitter.on("exit", function (code)
        {console.log("HERE", state.started);
            state.exited = { code };

            if (state.started)
                push("exit", state.exited);
        });

        push("started", { pid }, function (err)
        {
            state.started = true;

            if (state.exited)
                push("exit", state.exited);
        });            

        return { cancel: <kill pid = { pid } /> };
    }
}

function toKilling(state)
{
    return  <state status = "killing">
                { child("process", state) }
                <effect ref = "kill"
                        start = { <kill pid = { pid } /> } />
            </state>;
}


