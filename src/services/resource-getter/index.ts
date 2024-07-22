import fetch from 'node-fetch';

import path from 'path';
import fs from 'fs';
import { PathUtils } from '../../utils/path';
import { ResourceUtils } from '../../utils/resource';

export interface ResourceGetterConfig {
    host: string;
    port: number;
    path: string;
}

export class ResourceGetter {

    public constructor(
        private readonly config: ResourceGetterConfig
    ) {
    }

    public async getResource(route: string) {
        const routes = route.split(/[\/\\]/g).filter(Boolean);

        const _file = ResourceUtils.formatFileName(routes.pop());

        const _directories = path.join(...(routes.length === 5 ? ResourceUtils.decodePath(routes) : routes))
        const _path = path.join(this.config.path, _directories, _file);
        console.log(`Getting resource: ${_path}`);

        const cache = this.getResourceFromCache(_path);
        if (cache) {
            return cache;
        }

        console.log(`Resource not found in cache: ${_path}`);
        const resource = await this.getResourceFromNetwork(route);

        if (resource instanceof Buffer) {
            fs.mkdirSync(path.join(this.config.path, _directories), { recursive: true });
            fs.writeFileSync(_path, resource);
        }

        return resource;
    }

    public getResourceFromCache(_path: string) {
        if (fs.existsSync(_path)) {
            return fs.readFileSync(_path);
        }

        return null;
    }

    public getResourceFromNetwork = async (route: string, tries = 0): Promise<Buffer> => {
        return await fetch(`http://${this.config.host}:${this.config.port}/${route}`)
            .then((response) => {

                if (!response.ok) {
                    console.log(`Resource ${route} not found: ${response.status}`)
                    return null;
                }

                return response.buffer();
            })
            .catch(error => {
                if (error instanceof Error)
                    console.error(`Error fetching resource: ${error.message}`);

                if (tries < 3) {
                    console.log(`Retrying (${tries + 1}/3)...`);
                    return this.getResourceFromNetwork(route, tries + 1);
                }

                return null;
            })
    }
}