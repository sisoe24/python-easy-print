import * as doc from "./document_parser";
import * as vscode from "vscode";

import { getConfig } from "./config";
import { SelectedText } from "./selected_text";
import { printConstructor } from "./print_constructor";
import { PRINT_COMMANDS, DOCUMENT_COMMANDS } from "./commands";
import { PythonSnippetCompletionProvider } from "./completion_items";

export async function executeCommand(
    formatString: string
): Promise<string | void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    const selectedText = new SelectedText(editor);

    const text = selectedText.getText();
    if (!text) {
        return;
    }

    if (getConfig().get("prints.useDoubleQuotes")) {
        formatString = formatString.replace(/'/g, '"');
    }

    for (const match of text) {
        if (selectedText.hasCodeBlock()) {
            await vscode.commands.executeCommand("editor.action.jumpToBracket");
            await vscode.commands.executeCommand("editor.action.jumpToBracket");
        }

        await vscode.commands
            .executeCommand("editor.action.insertLineAfter")
            .then(() => {
                const stringStatement = printConstructor(formatString);

                const insertText = stringStatement.replace(/\{text\}/g, match);

                editor.edit((editBuilder) => {
                    const { selection } = editor;

                    editBuilder.insert(
                        new vscode.Position(
                            selection.start.line,
                            selection.start.character
                        ),
                        insertText
                    );
                });
            });
    }
}

export function activate(context: vscode.ExtensionContext): void {
    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(
            "python",
            new PythonSnippetCompletionProvider(),
            "."
        )
    );

    // Print Commands
    for (const statement of Object.values(PRINT_COMMANDS)) {
        context.subscriptions.push(
            vscode.commands.registerCommand(statement.command, () => {
                executeCommand(statement.formatString);
            })
        );
    }

    // Document parser
    for (const [action, command] of Object.entries(DOCUMENT_COMMANDS)) {
        context.subscriptions.push(
            vscode.commands.registerCommand(command, () => {
                void doc.executeCommand(action);
            })
        );
    }
}
