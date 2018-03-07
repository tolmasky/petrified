const commands = require("commander");

require("./command")(commands);

commands.parse(process.argv);
