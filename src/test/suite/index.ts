import * as fs from 'fs';
import * as path from 'path';
import * as Mocha from 'mocha';

export function run(): Promise<void> {
    const mocha = new Mocha({ ui: 'tdd', color: true });

    fs.readdirSync(__dirname)
        .filter((f) => f.endsWith('.test.js'))
        .forEach((f) => mocha.addFile(path.resolve(__dirname, f)));

    return new Promise((resolve, reject) => {
        mocha.run((failures) => {
            if (failures > 0) {
                reject(new Error(`${failures} tests failed.`));
            } else {
                resolve();
            }
        });
    });
}
