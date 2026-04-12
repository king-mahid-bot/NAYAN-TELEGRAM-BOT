const { spawn } = require("child_process");
console.clear();
function startBot(message) {
    (message) ? logger(message, "starting") : "";



  const child = spawn("node", ["main.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });
  child.on("close", (codeExit) => {
        if (codeExit != 0 || global.countRestart && global.countRestart < 5) {
            startBot();
            global.countRestart += 1;
            return;
        } else return;
    });

  child.on("error", function(error) {
      console.log("an error occurred : " + JSON.stringify(error), "error");
  });
};
startBot();