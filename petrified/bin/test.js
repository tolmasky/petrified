const watcher = require("@atom/watcher");

(async function () {
    
    const { filesChanged } = require("./files-changed/get-files-changed")(__dirname, () => true);
    const events = await filesChanged();

    console.log(events.map(event => events.path).join(" ") + " changed!");

    const events = await filesChanged();

    console.log(events.map(event => events.path).join(" ") + " changed!");
/*
await watcher.watchPath(__dirname, {}, events => {
  console.log(`Received batch of ${events.length} events.`)
  for (const event of events) {
    // "created", "modified", "deleted", "renamed"
    console.log(`Event action: ${event.action}`)

    // Absolute path to the filesystem entry that was touched
    console.log(`Event path: ${event.path}`)

    // "file", "directory", "symlink", or "unknown"
    console.log(`Event entry kind: ${event.kind}`)

    if (event.action === 'renamed') {
      console.log(`.. renamed from: ${event.oldPath}`)
    }
  }
})*/

console.log("DONE!");
})();
