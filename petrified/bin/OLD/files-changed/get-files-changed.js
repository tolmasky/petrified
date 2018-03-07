const { EventEmitter } = require("events");
const { watchPath } = require("@atom/watcher");
const { isMatch } = require("micromatch");

const event = require("@await/event");
const eventEmitters = { };


module.exports = function filesChanged({ source, match })
{
    const eventEmitter = getEventEmitter(source);
    const test = toMatch(match);

    const canceled = Symbol();
    const resolveOn = ["files-changed", canceled];
  
    const cancel = () => eventEmitter.emit(canceled);
    const waiting = event({ eventEmitter, resolveOn })
        .then([_, events] => console.log(_));

    return Object.assign(waiting, { cancel });
/*
    return function ()
    {
        const await 
    }

    eventEmitter.on();
    const emit = events => events.length > 0 &&
        eventEmitter.emit("files-changed", events);
    const watcher = watchPath(source, { }, events =>
        emit(events.filter(event => matches(event.path))));

    const canceled = Symbol();
    const cancel = () => eventEmitter.emit(canceled);

    const resolveOn = ["files-changed", canceled];
    const filesChanged = event({ eventEmitter, resolveOn });

    return Object.assign(filesChanged, { cancel });*/
}

function getEventEmitter(source)
{
    if (eventEmitters[source])
        return eventEmitters[source].reference();

    const referenceCount = 0;
    const reference = () => (++referenceCount, eventEmitters);
    const dereference = () => --referenceCount;

    const eventEmitters = Object.assign(new EventEmitter(), dereference);
    const watcher = watchPath(source, { },
        events => emitter.emit("files-changed", events));

    eventEmitters[source] = { reference, watcher };

    return reference();
}

function toMatch(match)
{
    if (typeof match === "function")
        return match;

    if (typeof match === "string")
        return path => isMatch(path, match);

    if (typeof match === "undefined" || match === true)
        return () => true;

    throw TypeError("Bad type for match");
}