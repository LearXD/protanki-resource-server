import { Server } from "./server";

const server = new Server({ port: 80 });
server.start().then((port) => {
    console.log(`Server is running on port ${port}`);
});
