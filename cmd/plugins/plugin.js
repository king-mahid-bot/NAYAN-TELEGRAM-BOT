const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "plugin", // Command name
    aliases: ["load", "install"], // Command aliases
    prefix: true, // Requires prefix
    permission: 0, // Permission level (0 = everyone, 1 = admins, etc.)
  },
  start: async ({ api, event, botInfo, isGroup }) => {
    const { msg } = event;
    const chatId = msg.chat.id;
    const text = event.body;

    // Command handling logic
    const commandParts = text.split(" "); // Split the command and its arguments
    const command = commandParts[0].toLowerCase();
    const pluginName = commandParts[1]; // Plugin name passed after the command

    if (!pluginName) {
      return await api.sendMessage(chatId, "Please specify a plugin name.");
    }

    switch (command) {
      case "load":
        // Logic for loading a plugin
        try {
          await loadPlugin(pluginName, api, event, botInfo, isGroup);
          await api.sendMessage(chatId, `Plugin "${pluginName}" has been loaded successfully.`);
        } catch (error) {
          await api.sendMessage(chatId, `Failed to load plugin "${pluginName}": ${error.message}`);
        }
        break;

      case "install":
        // Logic for installing a plugin (e.g., downloading from a source)
        try {
          await installPlugin(pluginName);
          await api.sendMessage(chatId, `Plugin "${pluginName}" has been installed successfully.`);
        } catch (error) {
          await api.sendMessage(chatId, `Failed to install plugin "${pluginName}": ${error.message}`);
        }
        break;

      default:
        await api.sendMessage(chatId, "Invalid command. Use /plugin load <plugin> or /plugin install <plugin>.");
        break;
    }
  },
};

// Function to load the plugin dynamically and handle changes
async function loadPlugin(pluginName, api, event, botInfo, isGroup) {
  const pluginPath = path.resolve(__dirname, `${pluginName}.js`);

  if (!fs.existsSync(pluginPath)) {
    throw new Error(`Plugin "${pluginName}" does not exist.`);
  }

  try {
    // Clear the cache for this plugin to ensure fresh loading
    delete require.cache[require.resolve(pluginPath)];

    // Dynamically require the plugin
    const plugin = require(pluginPath);

    // If the plugin has a start method, run it

    if (plugin.start) {
      await plugin.start({ api, event, botInfo, isGroup });
    }
    
    console.log(`Plugin "${pluginName}" loaded.`);
  } catch (error) {
    throw new Error(`Error loading plugin "${pluginName}": ${error.message}`);
  }
}

// Function to install a plugin (e.g., downloading or copying files)
async function installPlugin(pluginName) {
  // For the sake of example, let's simulate installing the plugin
  const pluginPath = path.resolve(__dirname, 'plugins', `${pluginName}.js`);

  if (fs.existsSync(pluginPath)) {
    throw new Error(`Plugin "${pluginName}" is already installed.`);
  }

  try {
    // Simulate installing the plugin by creating an empty file (or you can copy a real file here)
    fs.writeFileSync(pluginPath, `module.exports = { start: async () => { console.log("Plugin ${pluginName} started."); } };`);
    console.log(`Plugin "${pluginName}" installed.`);
  } catch (error) {
    throw new Error(`Error installing plugin "${pluginName}": ${error.message}`);
  }
}
