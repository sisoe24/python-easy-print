import * as vscode from "vscode";

import * as config from "./config";
import { PRINT_COMMANDS } from "./commands";
import { DataModel, PlaceholdersConverter } from "./print_constructor";


export class PythonSnippetCompletionProvider
    implements vscode.CompletionItemProvider
{
    position: vscode.Position = new vscode.Position(0, 0);

    /**
     * Initialize the provider.
     *
     * @param document vscode TextDocument
     * @param position cursor position
     * @returns the provider result or null
     */
    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position
    ): vscode.ProviderResult<vscode.CompletionItem[]> {
        const linePrefix = document
            .lineAt(position)
            .text.substring(0, position.character);
        const match = linePrefix.match(/(\w+)\.$/) || [];
        const variableName = match[1];

        if (!variableName) {
            return undefined;
        }
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            throw new Error("No active text editor");
        }

        const data = new DataModel(editor, config.getConfig());

        const items: vscode.CompletionItem[] = [];
        for (const [k, v] of Object.entries(PRINT_COMMANDS)) {
            const item = new vscode.CompletionItem(
                k,
                vscode.CompletionItemKind.Snippet
            );

            const converter = new PlaceholdersConverter(v.formatString, data);
            item.insertText = new vscode.SnippetString(
                converter.convert().replace(/\{text\}/g, variableName)
            );

            item.additionalTextEdits = [
                vscode.TextEdit.delete(
                    new vscode.Range(
                        position.translate(0, -variableName.length - 1),
                        position
                    )
                ),
            ];

            items.push(item);
        }

        return items;
    }
}
