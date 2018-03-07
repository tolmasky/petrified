console.log("before - 1");
setImmediate(() => console.log("before - 2"));
process.nextTick(() => console.log("before - 3"));

(new Promise(function (resolve, reject)
{
    console.log("after - 1");
    setImmediate(() => console.log("after - 2"));
    process.nextTick(() => console.log("after - 3"));
    resolve(5);
})).then(() => console.log("done"));
/*
var answer = 0;

function next_one()
{
    return new Promise(function (resolve, reject)
    {process.nextTick(() => ++answer);
        resolve(answer++);
    })
}

next_one().then((x) => console.log(x));
next_one().then((x) => console.log(x));*/


/*
before - 1
after - 1
before - 3
after - 3
done
before - 2
after - 2

/*const files = require("./files-watcher")({ source: "/Users/tolmasky/Desktop" });

(async function ()
{
    await files.changed();

    while (true)
    {
        // Wait 100 milliseconds before actually kicking things off, in case
        // more files change. As long as files keep changing, there's no reason
        // to start a build since it would just be cancelled.
        while (await files.changed.during(delay(100)))
            ;

        // Start the deploy.
        const { cancel, handling } = handler();

        // If a file changes during the deploy, cancel.
        if (await files.changed.during(handling))
            await cancel();
        else
            await files.changed();
    }
})();*/

