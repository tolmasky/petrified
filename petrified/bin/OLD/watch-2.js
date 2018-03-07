
const { watchPath } = require("@atom/watcher");
const event = require("@await/event");
const getFilesChanged = require("@await/files-changed");

const EventEmitter = require("events");
const delay = time => new Promise(resolve => setTimeout(resolve, time));
const { race } = Promise.race;


module.exports = async function (source, match, handler)
{
    console.log("Starting to watch...");

    const filesChangedDuring = getFilesChanged(source, match);

    await filesChangedDuring();

    while (true)
    {
        // Wait 100 milliseconds before actually kicking things off, in case
        // more files change. As long as files keep changing, there's no reason
        // to start a build since it would just be cancelled.
        while (await fileChangedDuring(delay(100)))
            ;

        // Start the deploy.
        const { cancel, handling } = handler();

        // If a file changes during the deploy, cancel.
        if (await fileChangedDuring(handling))
            await cancel();
        else
            await filesChangedDuring();
    }
}



module.exports = async function ()
{
    // A bit of a hack...
    await ssh("cd /tonic/build && yarn install");

    // Forward logs from the server while we do this.
    ssh("node /tonic/develop/watch/remote/log");

    // Observe the primary images as well as their dependencies.
    const { primaryDependencies, images } = require("./images");
    const { fileChanged, fileChangedDuring } = getFileChanged(primaryDependencies, images);

    console.log("Starting to watch...");

    // First file starts it all off...
    await fileChanged();

    while (true)
    {
        // Wait 100 milliseconds before actually kicking things off, in case
        // more files change. As long as files keep changing, there's no reason
        // to start a build since it would just be cancelled.
        while (await fileChangedDuring(delay(100)))
            ;

        // Start the deploy.
        const { cancelDeployment, deploying } = deploy();

        // If a file changes during the deploy, cancel.
        if (await fileChangedDuring(deploying))
            await cancelDeployment();
        else
            await fileChanged();
    }
}

function filesChanged(source, matches)
{
    const eventEmitter = new EventEmitter();
    const never = new Promise(() => { });

    const emit = events => events.length > 0 &&
        eventEmitter.emit("files-changed", events);
    const watcher = watchPath(source, { }, events =>
        emit(events.filter(event => match(event.path))));

    async function filesChangedDuring(during = never)
    {
        const completed = Symbol();
        const resolveOn = ["files-changed", completed];
        const filesChanged = event({ eventEmitter, resolveOn });

        const [events, filesDidChange] = await race([
            filesChanged.then(result => [result, true],
            during.then(result => [result, false])
        ]);

        eventEmitter.emit(completed);

        if (filesDidChange)
            announce(`${result.name} ${result.value}`);

        return [events, filesDidChange];
    }
    
    const filesChanged = () => fileChangedDuring();
    const done = () => watcher.dispose();

    return { filesChanged, filesChangedDuring, done };
}

