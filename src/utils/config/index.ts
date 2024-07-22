import fs from 'fs';
import path from 'path';

export class Config {

    private static _path: string;
    private static data: { [key: string]: any } = {};

    public constructor() { }

    public static init(_path: string) {
        this._path = path.resolve(_path);

        if (!fs.existsSync(this._path)) {
            fs.mkdirSync(path.dirname(this._path), { recursive: true });
            fs.writeFileSync(this._path, '{}', 'utf8');
        }

        this.load();
    }

    public static load() {
        if (!fs.existsSync(this._path)) {
            return;
        }

        const data = fs.readFileSync(this._path, 'utf8');
        this.data = JSON.parse(data);
    }

    public static get<R = any>(key: string, defaultValue: R = null) {
        return this.data[key] || defaultValue;
    }
}