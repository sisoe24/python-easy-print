import * as path from 'path';
import * as vscode from 'vscode';

import { DEFAULTS, getConfig, Config } from './config';

export class DataModel {
    public config: Config;
    public editor: vscode.TextEditor;

    constructor(editor: vscode.TextEditor, config: Config) {
        this.config = config;
        this.editor = editor;
    }

    /**
     * Get the workspace relative file path.
     *
     * @returns a string like path or an empty string if could not resolve the path.
     */
    getWorkspacePath(): string {
        const relativePath = vscode.workspace.asRelativePath(
            this.editor.document.uri
        );

        if (!relativePath) {
            return "";
        }
        return relativePath;
    }

    getFilename(): string {
        return path.basename(this.editor.document.fileName);
    }

    getLineNum(): string {
        const lineNum = this.editor.selection.start.line + 1;
        return lineNum.toString();
    }

    getLogger(): string {
        return this.config.get(
            "logging.customLogName",
            DEFAULTS.customLogName
        ) as string;
    }

    getSymbol(): string {
        return this.config.get(
            "prints.customSymbol",
            DEFAULTS.printSymbol
        ) as string;
    }

    getCustomMessage(): string {
        return this.config.get(
            "prints.customStatement",
            DEFAULTS.customStatement
        ) as string;
    }

    getConfigPlaceholders(): string {
        return this.config.get("prints.addCustomMessage") as string;
    }

    /**
     * Get the function for the print statement.
     *
     * Traverse in reverse the document to search the first matching `def`
     * that is less indented. If statement has no function definition then method
     * will do nothing and return an empty string.
     *
     * @returns the function name or an empty string if no function is found.
     */
    getFuncName(): string {
        const startLine = this.editor.selection.active.line;
        const startLineIndentation =
            this.editor.document.lineAt(
                startLine
            ).firstNonWhitespaceCharacterIndex;

        if (startLineIndentation === 0) {
            return "";
        }

        for (let l = startLine; l >= 0; --l) {
            const line = this.editor.document.lineAt(l);

            if (line.isEmptyOrWhitespace) {
                continue;
            }

            const currentLineIndentation =
                line.firstNonWhitespaceCharacterIndex;

            const match = /def\s(\w+)\(.*\):/.exec(line.text);
            if (match && startLineIndentation > currentLineIndentation) {
                return match[1];
            }

            if (currentLineIndentation === 0) {
                break;
            }
        }

        return "";
    }
}

/**
 * Convert placeholders symbols from the configuration settings.
 */
export class PlaceholdersConverter {
    private data: DataModel;
    public statement: string;

    /**
     * Init method to initialize the class.
     *
     * @param editor vscode active text editor
     */
    constructor(statement: string, data: DataModel) {
        this.statement = statement;
        this.data = data;
    }

    /**
     * Convert the placeholders symbols from the configuration settings.
     *
     * @param key the placeholder key to convert: %f, %l, %F, %w.
     * @returns the converted placeholder.
     */
    private convertPlaceholders(placeholders: string): string {
        const placeholdersMap: { [key: string]: string } = {
            "%f": this.data.getFilename(),
            "%l": this.data.getLineNum(),
            "%F": this.data.getFuncName(),
            "%w": this.data.getWorkspacePath(),
        };

        const placeholderMatch = placeholders.match(/%[flFw]/g);

        if (placeholderMatch) {
            placeholderMatch.forEach((placeholder) => {
                placeholders = placeholders.replace(
                    placeholder,
                    placeholdersMap[placeholder]
                );
            });
        }
        return placeholders;
    }

    private convertLog(): string {
        let s = this.statement.replace("{logger}", this.data.getLogger());

        if (this.data.config.get("logging.useRepr")) {
            s = s.replace("{#text}", "repr({text})");
        } else {
            s = s.replace("{#text}", "{text}");
        }

        return s;
    }

    private convertPrint(): string {
        let placeholders = "";

        if (this.statement === "{@}") {
            placeholders = this.data.getCustomMessage();
        } else {
            placeholders = this.data.getConfigPlaceholders();
        }

        placeholders = this.convertPlaceholders(placeholders);

        // when no placeholders are present, we need to replace the {@} with a space
        const replaceToken = placeholders ? "{@}" : "{@} ";

        let s = this.statement
            .replace(replaceToken, placeholders)
            .replace("{symbol}", this.data.getSymbol());

        if (this.data.config.get("prints.printToNewLine")) {
            s = s.split(":'").join(":\\n'");
        }

        return s;
    }

    convert(): string {
        if (this.statement.includes("{logger}")) {
            return this.convertLog();
        }
        return this.convertPrint();
    }
}

/**
 * Get the string statement for the print command.
 *
 * The statement could be a print statement or a logging statement based on the
 * statement type. Placeholders are also converted if present.
 *
 * @returns the template statement: `print("➡ {text} :", {text})`
 */
export function printConstructor(formatString: string) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        throw new Error("No active text editor");
    }

    const data = new DataModel(editor, getConfig());
    const converter = new PlaceholdersConverter(formatString, data);
    return converter.convert();
}
