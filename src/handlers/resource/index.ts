import { ResourceGetter } from '../../services/resource-getter';
import { ProtankiUtils } from '../../utils/protanki';
import { ResourceUtils } from '../../utils/resource';

export interface IResourceData {
    a: string;
    b: string;
    c: string;
    d: string;
    version: string;
    file: string;
}

export class ResourceHandler {

    private resourceGetter: ResourceGetter;

    public constructor(
        private readonly path: string
    ) {
        this.resourceGetter = new ResourceGetter({
            host: ProtankiUtils.RESOURCE_HOST,
            port: ProtankiUtils.RESOURCE_PORT,
            path: this.path
        });
    }

    public handleResourceRoute(data: IResourceData): Promise<Buffer> {
        return this.resourceGetter.getResource(data);
    }

    public handleFileRoute(route: string) {
        return this.resourceGetter.getFile(route);
    }

}