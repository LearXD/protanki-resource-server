import * as xml from 'xmlbuilder2';
import fetch from 'node-fetch';
import path from 'path';
import fs from 'fs';

import { ResourceUtils } from '../../utils/resource';
import { IResourceData } from '../../handlers/resource';

export enum ResourceType {
    SWF = 'swf',
    LOCALE = 'locale',
    UNKNOWN = 'unknown'
}

export class ResourceGetter {

    public constructor(
        private readonly config: {
            host: string;
            port: number;
            path: string;
        }
    ) {
    }

    public async getFile(route: string) {
        const routes = route.split(/[\/\\]/g).filter(Boolean);

        if (routes.length === 0) {
            return null;
        }

        const _file = ResourceUtils.formatFileName(routes.pop());
        let type = ResourceType.UNKNOWN;

        if (routes.length === 0) {
            if (_file === 'config.xml') {
                return Buffer.from(
                    xml.create({ version: '1.0' })
                        .ele('cfg', { xmlns: 'http://alternativaplatform.com/core/config.xsd' })
                        .ele('server', { address: '127.0.0.1' })
                        .ele('port').txt('1338').up()
                        .up()
                        .ele('status').txt('available')
                        .end()
                );
            }

            if (_file.startsWith('localized.data')) {
                type = ResourceType.LOCALE;
            }

            if (_file.endsWith('.swf')) {
                type = ResourceType.SWF;
            }
        }

        const _directories = path.join(...routes)
        const _path = path.join(this.config.path, type, _directories, _file);

        console.log(`Getting file: ${_path}`);
        const cache = this.getFromCache(_path);
        if (cache) {
            return cache;
        }

        console.log(`File not found in cache: ${_path}`);
        const resource = await this.getFromNetwork(route);

        if (resource instanceof Buffer) {
            fs.mkdirSync(path.join(this.config.path, type, _directories), { recursive: true });
            fs.writeFileSync(_path, resource);
        }

        return resource;
    }

    public async getResource(route: IResourceData) {
        const _directories = path.join(...ResourceUtils.decodePath([route.a, route.b, route.c, route.d, route.version]));
        const _path = path.join(this.config.path, 'resources', _directories, route.file);

        console.log(`Getting resource: ${_path}`);

        const cache = this.getFromCache(_path);
        if (cache) {
            return cache;
        }

        console.log(`Resource not found in cache: ${_path}`);
        const resource = await this.getFromNetwork(`${route.a}/${route.b}/${route.c}/${route.d}/${route.version}/${route.file}`);

        if (resource instanceof Buffer) {
            fs.mkdirSync(path.join(this.config.path, 'resources', _directories), { recursive: true });
            fs.writeFileSync(_path, resource);
        }

        return resource;
    }

    public getFromCache(_path: string) {
        if (fs.existsSync(_path)) {
            return fs.readFileSync(_path);
        }

        return null;
    }

    public getFromNetwork = async (route: string, tries = 0): Promise<Buffer> => {
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
                    return this.getFromNetwork(route, tries + 1);
                }

                return null;
            })
    }
}