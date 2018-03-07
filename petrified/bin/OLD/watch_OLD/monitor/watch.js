const { createMonitor } = require("watch");
const actions = ["created", "changed", "removed"];
const { EventEmitter } = require("events");


module.exports = function ({ source, match })
{
    const emitter = new EventEmitter();
    let received = null;

    const fire = (action, path) =>
        match({ path }) && emitter.emit("change", [{ path, action }]);
    const register = monitor => action =>
        monitor.on(action, name => fire(action, name));

    const options =
    {
        ignoreDotFiles: true,
        ignoreNotPermitted: true,
        ignoreUnreadableDir: true
    };

    createMonitor(source, options, function (monitor)
    {
        actions.map(register(monitor));
        received = monitor;
    });

    return emitter;
//    return () => received && received.stop();
}
