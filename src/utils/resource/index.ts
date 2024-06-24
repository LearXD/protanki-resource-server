import { ByteArray } from "../byte-array"

export class ResourceUtils {

    public static encodePath(id: number, version: number) {
        const _id = new ByteArray();
        _id.writeInt(0);
        _id.writeInt(id)

        const _version = new ByteArray();
        _version.writeInt(0)
        _version.writeInt(version)

        return '/' + _id.readUnsignedInt().toString(8) +
            '/' + _id.readUnsignedShort().toString(8) +
            '/' + _id.readUnsignedByte().toString(8) +
            '/' + _id.readUnsignedByte().toString(8) +
            '/' + version + '/'
    }

    public static decodePath(path: string) {
        const [_, a, b, c, version] = path.split('/').filter(Boolean);

        const bytes = new ByteArray();
        bytes.writeUnsignedShort(parseInt(a, 8));
        bytes.writeUnsignedByte(parseInt(b, 8));
        bytes.writeUnsignedByte(parseInt(c, 8));

        return [bytes.readInt().toString(), version.toString()]
    }

    public static formatFileName(fileName: string) {
        const variablesPosition = fileName.indexOf('?');
        return fileName.substring(0, variablesPosition >= 0 ? variablesPosition : fileName.length);
    }

}