import express from 'express';
import path from 'path';

import { ResourceHandler } from './handlers/resource';

export interface ServerConfig {
    port: number;
}

export class Server {

    private server: express.Application;
    private resourceHandler: ResourceHandler;

    public constructor(
        private readonly config: ServerConfig
    ) {
        this.server = express();

        this.resourceHandler = new ResourceHandler({
            path: path.resolve('./resources')
        });
    }

    public registerRoutes() {
        this.server.use('/', async (req, res) => {
            const data = await this.resourceHandler.handleRoute(req.url.substring(1));
            res.write(data);
            res.end();
        });

    }

    public start() {
        return new Promise((resolve) => {
            this.server.listen(
                this.config.port, () => {
                    this.registerRoutes();
                    resolve(this.config.port)
                }
            );
        });
    }
}