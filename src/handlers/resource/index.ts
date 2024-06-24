import fs from 'fs';
import path from 'path';
import { ResourceGetter } from '../../services/resource-getter';
import { ProtankiUtils } from '../../utils/protanki';

export interface ResourceHandlerConfig {
    path: string;
}

export class ResourceHandler {

    private resourceGetter: ResourceGetter;

    public constructor(
        private readonly config: ResourceHandlerConfig
    ) {
        this.resourceGetter = new ResourceGetter({
            host: ProtankiUtils.RESOURCE_HOST,
            port: ProtankiUtils.RESOURCE_PORT,
            path: this.config.path
        });
    }

    public handleRoute(route: string) {
        return this.resourceGetter
            .getResource(route);
    }

    public getResource(route: string) {
    }
}