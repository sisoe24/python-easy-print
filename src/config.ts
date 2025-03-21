import * as vscode from 'vscode';

export const DEFAULTS = {
    printSymbol: "➡",
    customStatement: "print('\\n┌─ %w:%l - {text}\\n└─', {text})",
    customLogName: "logging",
};

export interface IConfiguration {
    get(property: string): unknown;
}

export class Config {
    private config: IConfiguration;

    constructor(configurations: IConfiguration) {
        this.config = configurations;
    }

    /**
     * Get configuration property value.
     *
     * If property name is not found, throws an error.
     *
     * @param property - name of the configuration property to get.
     * @returns - the value of the property.
     */
    get(property: string, missing?: unknown): unknown {
        const subConfig = this.config.get(property);

        if (typeof subConfig === "undefined") {
            throw new Error(`Configuration: ${property} doesn't exist`);
        }

        if ((subConfig === null || subConfig === "") && missing) {
              return missing;
        }

        return subConfig;
    }
}

export function getConfig(): Config {
    return new Config(vscode.workspace.getConfiguration("pythonEasyPrint"));
}
