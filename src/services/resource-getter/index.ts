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
        const routes = route.split(/\//g);

        const _file = ResourceUtils.formatFileName(routes.pop());
        const _directories = PathUtils.recursiveMkdir(
            routes.length === 5 ? ResourceUtils.decodePath(routes.join('/')) : routes,
            this.config.path
        );

        const _path = path.join(_directories, _file);
        const cache = this.getResourceFromCache(_path);

        if (cache) {
            // console.log(`Resource found in cache: ${_path}`);
            return cache;
        }

        console.log(`Resource not found in cache: ${_path}`);
        const resource = await this.getResourceFromNetwork(route);
        if (resource) {
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
        try {
            return fetch(`http://${this.config.host}:${this.config.port}/${route}`)
                .then((response) => response.buffer())
        } catch (error) {
            if (error instanceof Error)
                console.error(`Error fetching resource: ${error.message}`);

            if (tries >= 3) {
                console.log(`Retrying (${tries}/3)...`);
                return this.getResourceFromNetwork(route, tries + 1);
            }
            return null;
        }
    }
}