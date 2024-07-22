import { Server } from "./server";
import { Config } from "./utils/config";

Config.init('./config.json');

const server = new Server({ port: 80 });
server.start().then((port) => {
    console.log(`Server is running on port ${port}`);
});

