import * as vscode from "vscode";
import * as config from "./config";

type LineObject = {
    text: string;
    range: vscode.Range;
    rangeToNewLine: vscode.Range;
};

/**
 * Parse the entire document text and return an array of LineObject.
 *
 * @param editor vscode active text editor
 * @return lines An array of LineObject.
 */
export function documentParser(editor: vscode.TextEditor): Array<LineObject> {
    const { document } = editor;

    const symbol = config
        .getConfig()
        .get("prints.customSymbol", config.DEFAULTS.printSymbol);

    const lines = [];
    const matchPattern = new RegExp(`print\\(['"]${symbol}`);

    for (let l = 0; l <= document.lineCount - 1; ++l) {
        const line = document.lineAt(l);
        const text = line.text.trim();

        const match = matchPattern.exec(text);

        if (!match) {
            continue;
        }

        const startPos = new vscode.Position(
            l,
            line.firstNonWhitespaceCharacterIndex
        );

        lines.push({
            text: text,
            range: new vscode.Range(startPos, line.range.end),
            rangeToNewLine: line.rangeIncludingLineBreak,
        });
    }
    return lines;
}

/**
 * Parse entire file and comment lines created by extension
 *
 * @param editor vscode active text editor
 */
export function toggleComment(editor: vscode.TextEditor): void {
    editor.edit((editBuilder) => {
        for (const line of documentParser(editor)) {
            if (line.text.startsWith("#")) {
                editBuilder.replace(
                    line.range,
                    `${line.text.replace("# ", "").trim()}`
                );
            } else {
                editBuilder.replace(line.range, `# ${line.text}`);
            }
        }
    });
}

/**
 * Parse entire file and delete lines created by extension
 *
 * @param editor vscode active text editor
 */
export function deleteLines(editor: vscode.TextEditor): void {
    editor.edit((editBuilder) => {
        for (const line of documentParser(editor)) {
            editBuilder.delete(line.rangeToNewLine);
        }
    });
}

enum Direction {
    up,
    down,
}

/**
 * Move the cursor at a specific print location.
 *
 * @param lines An array of LineObject to iterate over. If the direction is up,
 * then the array must be reversed before.
 * @param editor vscode active text editor
 * @param direction A Direction enum value to indicate the search direction.
 * @returns
 */
function jumpToPrint(
    lines: Array<LineObject>,
    editor: vscode.TextEditor,
    direction: Direction
): boolean {
    for (const line of lines) {
        // Decide the line comparison operator based on the command direction
        let condition = line.range.start.line > editor.selection.start.line;
        if (direction === Direction.up) {
            condition = line.range.start.line < editor.selection.start.line;
        }

        if (condition) {
            editor.selection = new vscode.Selection(
                line.range.start,
                line.range.start
            );
            editor.revealRange(line.range);
            return false;
        }
    }
    return true;
}

/**
 * Move cursor to Previous print made by the extension.
 *
 * If no prints are available, then place the cursor at the end of the file and
 * try again.
 *
 * @param editor vscode active text editor
 */
export function jumpPrintPrevious(editor: vscode.TextEditor): void {
    const endOfFile = jumpToPrint(
        documentParser(editor).reverse(),
        editor,
        Direction.up
    );
    if (endOfFile) {
        const lastLine = editor.document.lineCount;
        editor.selection = new vscode.Selection(lastLine, 0, lastLine, 0);
        jumpToPrint(documentParser(editor).reverse(), editor, Direction.up);
    }
}

/**
 * Move cursor to Next print made by the extension.
 *
 * If no prints are available, then place the cursor at the start of the file and
 * try again.
 *
 * @param editor vscode active text editor
 */
export function jumpPrintNext(editor: vscode.TextEditor): void {
    const endOfFile = jumpToPrint(
        documentParser(editor),
        editor,
        Direction.down
    );
    if (endOfFile) {
        editor.selection = new vscode.Selection(0, 0, 0, 0);
        jumpToPrint(documentParser(editor), editor, Direction.down);
    }
}

/**
 * Execute the specified command.
 *
 * @param action name of the action to be executed: `comment`, `uncomment` or `delete`.
 * If action is not valid will throw an error.
 * @returns
 */
export function executeDocumentCommand(action: string): void {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        return;
    }

    switch (action) {
        case "comment":
            toggleComment(editor);
            break;
        case "delete":
            deleteLines(editor);
            break;
        case "jumpPrevious":
            jumpPrintPrevious(editor);
            break;
        case "jumpNext":
            jumpPrintNext(editor);
            break;
        default:
            throw new Error(`Command: ${action} not implemented`);
    }
}
