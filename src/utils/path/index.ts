import fs from 'fs';
import path from 'path';

export class PathUtils {

    public static recursiveMkdir(directories: string[], baseDir?: string) {
        let directory = path.resolve(baseDir || '.');

        for (const dir of directories) {
            directory = path.join(directory, dir);
            if (!fs.existsSync(directory)) {
                fs.mkdirSync(directory);
            }
        }

        return directory;
    }
}