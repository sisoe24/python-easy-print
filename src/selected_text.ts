import * as vscode from 'vscode';

import { Config, getConfig } from './config';

type BracketType = {
    opening: string;
    closing: string;
};

const BRACKETS: { [key: string]: BracketType } = {
    "(": { opening: "(", closing: ")" },
    "[": { opening: "[", closing: "]" },
};

/**
 * Find the matching parentheses.
 *
 * @param startPos start position from where to start searching.
 * @returns
 */
function findBrackets(
    text: string,
    bracket: BracketType,
    startPos: number
): number[] | null {
    const stack: number[] = [];
    const openingBracket: number[] = [];

    for (let endPos = startPos; endPos < text.length; endPos++) {
        if (text[endPos] === bracket.opening) {
            openingBracket.push(endPos);
            stack.push(endPos);
        } else if (text[endPos] === bracket.closing) {
            stack.pop();

            if (stack.length === 0 && openingBracket.length > 0) {
                return [openingBracket[0], endPos];
            }
        }
    }

    return null;
}

/**
 * Select text object class.
 *
 * The class deals with the selection that could be either manually from the user,
 * or automatically from vscode hovering cursor position.
 *
 */
export class SelectedText {
    selection: vscode.Selection;
    document: vscode.TextDocument;
    editor: vscode.TextEditor;

    hoverWord: string;

    lineText: string;
    lineNumber: number;
    cursorPosition: number;
    config: Config;

    /**
     * Init method to initialize the selection.
     *
     * @param editor Current active text editor.
     */
    constructor(editor: vscode.TextEditor) {
        this.editor = editor;
        this.config = getConfig();

        this.document = editor.document;
        this.selection = editor.selection;

        this.hoverWord = "";

        this.lineNumber = this.selection.active.line;
        this.lineText = this.editor.document.lineAt(this.lineNumber).text;
        this.cursorPosition = this.editor.document.offsetAt(
            this.selection.active
        );
    }

    /**
     * Include parent calls if any: `foo.bar.foo`.
     *
     * This method will activate only if settings `includeParentCall` is enabled.
     *
     * This will check if the selected/hover word has any parent objects by searching
     * to the left of the word. If yes then it will return till the
     * last valid parent.
     *
     * @param startChar the character position from where to start the line parsing.
     * @param endChar the character position where to end the line parsing.
     * @returns the chain of parents or an empty string if there are none.
     */
    private includeParents(startChar: number, endChar: number): string {

        if (
            !this.config.get("hover.includeParentCall") ||
            this.lineText[startChar - 1] !== "."
        ) {
            return "";
        }

        let currentPos = endChar - 1;
        while (currentPos > 0) {
            if (!/^[0-9a-zA-Z_.()\\[\]'"]$/.test(this.lineText[currentPos])) {
                ++currentPos;
                break;
            }

            --currentPos;
        }

        const lineRange = new vscode.Range(
            new vscode.Position(this.lineNumber, currentPos),
            new vscode.Position(this.lineNumber, endChar)
        );

        return this.document.getText(lineRange).trim();
    }

    /**
     * Include function parentheses if any: `foo(x, y)`.
     *
     * This method will activate only if settings `includeParentheses` is enabled.
     *
     * This will check if the selected/hover word has an execution call by searching
     * if there any parentheses to the right of the word. If yes, then it will return
     * the parentheses with everything inside.
     *
     * @param endChar the end character position of the word.
     * @returns the function call parenthesis with arguments or an empty string
     * no match was made.
     */
    private includeFuncCall(endChar: number): string {
        const bracketType = BRACKETS[this.lineText[endChar]];

        if (!this.config.get("hover.includeParentheses") || !bracketType) {
            return "";
        }

        const { document } = this.editor;

        const pos = findBrackets(
            document.getText(),
            bracketType,
            this.cursorPosition
        );
        if (!pos) {
            return "";
        }

        const lineRange = new vscode.Range(
            document.positionAt(pos[0]),
            document.positionAt(pos[1] + 1)
        );

        return document.getText(lineRange);
    }

    /**
     * Get the word and the cursor position.
     *
     * Before returning the text, will also check for the configuration settings
     * and add to selection if settings require so.
     *
     * @returns the text under the cursor or `null` if no text is present.
     */
    private textUnderCursor(): string | null {
        const rangeUnderCursor = this.document.getWordRangeAtPosition(
            this.selection.active
        );

        if (!rangeUnderCursor) {
            return null;
        }

        this.hoverWord = this.document.getText(rangeUnderCursor);
        if (!this.hoverWord) {
            return null;
        }

        const startChar = rangeUnderCursor.start.character;
        const endChar = rangeUnderCursor.end.character;

        const parentCall = this.includeParents(startChar, endChar);
        const funcCall = this.includeFuncCall(endChar);

        return (parentCall || this.hoverWord) + funcCall;
    }

    /**
     * Check if line has an opening code block.
     *
     * A code block starts with a `(`, `[` or `{`. If any of those characters are
     * matched, it assumed to be a code block.
     *
     * @returns true if code contains a code block, false otherwise.
     */
    hasCodeBlock(): boolean {
        return /[{([]/.test(this.lineText);
    }

    private cleanText(text: string): string {

        // invert the quotes inside the selected text
        if (getConfig().get("prints.useDoubleQuotes")) {
            text = text.replace(/"/g, "'");
        } else {
            text = text.replace(/'/g, '"');
        }

        return text
            .replace(/\r?\n/g, "")
            .replace(/\s+/g, " ")
            .trim();
    }

    /**
     * Get the selected text.
     *
     * Selected text could be the manual selection or the hover selection. If the text
     * is manually selected, then the method will try to split the text by comma if the
     * setting `multipleStatements` is enabled.
     *
     * @returns the selected word or `null` no selection.
     */
    getText(): string[] | null {
        const selectedText = this.document.getText(this.selection);

        if (selectedText) {
            if (this.config.get("multipleStatements")) {
                return selectedText.split(",").map((s) => s.trim());
            }

            return [this.cleanText(selectedText)];
        }

        const hoverText = this.textUnderCursor();
        if (!hoverText) {
            return null;
        }

        return [this.cleanText(hoverText)];
    }
}
