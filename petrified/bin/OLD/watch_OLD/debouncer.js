const { state, property } = require("@effects/state");
const update = require("@effects/state/update");

module.exports = state.machine `Debouncer`
({
    [property.child `effect`]: "object",
    
    [state `initial`]: 
    {
        [state.on `#effect.change`]: 
    }
    
    [state `debouncing`]:
    {
    }
})

const { state, property } = require("@effects/state");
const update = require("@effects/state/update");

const start = ({ template }) => update
    .prop("state", "running")
    .prop("process", template);

module.exports = state.machine `ProcessLoop`
({
    [property.child `process`]: "object",

    ["init"]: loop => loop.autostart ?
        start(loop) :
        update.prop("state", "waiting"),

    [state `waiting`]:
    {
        [state.on `start`]: ({ template }, event) => update
            .prop("state", "running")
            .prop("process", template)
    },

    [state `running`]:
    {
        [state.on `#process.finished`]: update
            .prop("state", "waiting"),

        [state.on `start`]: update
            .prop("state", "killing-then-start")
            .update("process", "kill")
    },

    [state `killing-then-start`]:
    {
        [state.on `#process.finished`]: update
            .prop("state", "waiting")
            .update("process", "start"),

        [state.on `start`]: loop => loop
    }
});
