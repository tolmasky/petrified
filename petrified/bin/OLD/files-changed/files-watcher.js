const { EventEmitter } = require("events");
const { watchPath } = require("@atom/watcher");
const { isMatch } = require("micromatch");
const tuple = (left, promise) => promise.then(result => [left, result]);


module.exports = function files({ source, match })
{
    const emitter = new EventEmitter();
    const state = { emitter, buffered:[], canceled:false, watching:false };
    const watcher = watchPath(source, { }, buffer(state, toMatch(match)));

    return { changed };

    function during(parallel)
    {
    //.then(events => observed.events = events)
        const watch = changed();

        return Promise.race([tuple(true, watch), tuple(false, parallel)])
            .then(function ([finished, result])
            {
                if (!finished)
                {
                    watch.cancel();
                    process.nextTick(() =>
                    {
                        
                    });
                }

                return [finished, result];
            });

            watch, parallel.then(result => [false, result])]);

        if (!finished)
            promise.cancel();

        return new Promise(function (resolve, reject)
        {
            if (finished)
                return resolve([finished, result]);

            promise.cancel();

            process.nextTick(() =>
            {
                
            });
        });
        process.nextTick(() => 
        if (!finished)
        {
            state.buffered = observed.events.concat(state.buffered);
            watch.cancel();
        }

        return result;
    }

    async function changed()
    {
        const cancel = () => (state.canceled = true, emitter.emit("canceled"));
        const promise = new Promise(function (resolve, reject)
        {
            if (state.watching)
                return reject(new Error("Already watching"));

            state.watching = true;

            emitter.on("files-changed", finish);
            emitter.on("canceled", finish);

            if (state.buffered.length > 0)
                return finish();

            function finish()
            {
                state.watching = false;

                emitter.removeListener("files-changed", finish);
                emitter.removeListener("canceled", finish);

                if (state.canceled)
                    return resolve([false, []]);

                const events = state.buffered;
                state.buffered = [];

                return resolve([true, events]);
            }
        });

        return Object.assign(promise, { cancel });
    }
}

function buffer(state, match)
{
    return function (events)
    {
        if (events.length <= 0)
            return;

        state.buffered.push(...events);
        state.emitter.emit("files-changed");
    }
}

function toMatch(match)
{
    if (typeof match === "string")
        return event => isMatch(event.path, match);

    if (typeof match === "function")
        return event => match(event.path);

    if (typeof match === "undefined" || match === true)
        return () => true;

    throw new TypeError("No type for match");
}
