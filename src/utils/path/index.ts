import fs from 'fs';
import path from 'path';

export class PathUtils {

    public static recursiveMkdir(directories: string[] | string, baseDir?: string) {
        if (!Array.isArray(directories)) {
            directories = directories.split(/[\/\\]/g).filter(Boolean)
        }

        let directory = path.resolve(baseDir || '.');

        for (const dir of directories) {
            directory = path.join(directory, dir);
            if (!fs.existsSync(directory)) {
                fs.mkdirSync(directory);
            }
        }
    }
}