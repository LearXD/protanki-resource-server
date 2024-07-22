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
        this.resourceHandler = new ResourceHandler(path.resolve('./assets'));
        this.server = express();
    }

    public registerRoutes() {
        this.server.use('/:a/:b/:c/:d/:version/:file', async (req, res) => {
            const data = await this.resourceHandler.handleResourceRoute(req.params);

            if (data instanceof Buffer) {
                res.write(data);
            }

            res.end();
        });

        this.server.use('/', async (req, res) => {
            const data = await this.resourceHandler.handleFileRoute(req.url);

            if (data instanceof Buffer) {
                res.write(data);
            }

            res.end();
        });

    }

    public start() {
        return new Promise((resolve) => {
            this.registerRoutes();
            this.server.listen(this.config.port, () => {
                resolve(this.config.port)
            });
        });
    }
}