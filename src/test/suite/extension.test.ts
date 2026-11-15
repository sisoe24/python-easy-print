import * as assert from 'assert';
import * as vscode from 'vscode';

import { Config } from '../../config';
import { documentParser } from '../../document_parser';
import { DataModel, PlaceholdersConverter } from '../../print_constructor';
import { SelectedText } from '../../selected_text';

const DEFAULT_SETTINGS: Record<string, unknown> = {
    "prints.addCustomMessage": "",
    "prints.customStatement": "print('{symbol} {text}:', {text})",
    "prints.customSymbol": "🐛",
    "prints.printToNewLine": false,
    "prints.useDoubleQuotes": false,
    "logging.customLogName": "logging",
    "logging.useRepr": false,
};

async function openEditor(content: string): Promise<vscode.TextEditor> {
    const document = await vscode.workspace.openTextDocument({
        language: "python",
        content,
    });
    return vscode.window.showTextDocument(document);
}

function placeCursor(editor: vscode.TextEditor, line: number, character: number): void {
    editor.selection = new vscode.Selection(line, character, line, character);
}

function convert(
    editor: vscode.TextEditor,
    statement: string,
    settings: Record<string, unknown> = {}
): string {
    const config = new Config({
        get: (key: string) => ({ ...DEFAULT_SETTINGS, ...settings })[key],
    });
    return new PlaceholdersConverter(statement, new DataModel(editor, config)).convert();
}

suite("PlaceholdersConverter", () => {
    let editor: vscode.TextEditor;

    suiteSetup(async () => {
        editor = await openEditor("x = 1\n");
        placeCursor(editor, 0, 0);
    });

    test("print statement", () => {
        assert.strictEqual(
            convert(editor, "print('{symbol} {@} {text}:', {text})"),
            "print('🐛 {text}:', {text})"
        );
    });

    test("double quotes", () => {
        assert.strictEqual(
            convert(editor, "print('{symbol} {@} {text}:', {text})", {
                "prints.useDoubleQuotes": true,
            }),
            'print("🐛 {text}:", {text})'
        );
    });

    test("double quotes with print to new line", () => {
        assert.strictEqual(
            convert(editor, "print('{symbol} {@} {text}:', {text})", {
                "prints.useDoubleQuotes": true,
                "prints.printToNewLine": true,
            }),
            'print("🐛 {text}:\\n", {text})'
        );
    });

    test("double quotes in custom statement", () => {
        assert.strictEqual(
            convert(editor, "{@}", { "prints.useDoubleQuotes": true }),
            'print("🐛 {text}:", {text})'
        );
    });

    test("logging with repr", () => {
        assert.strictEqual(
            convert(editor, "{logger}.debug('{text}: %s', {#text})", {
                "logging.useRepr": true,
            }),
            "logging.debug('{text}: %s', repr({text}))"
        );
    });

    test("function name with return annotation", async () => {
        const funcEditor = await openEditor("def foo(x) -> int:\n    return x\n");
        placeCursor(funcEditor, 1, 4);
        assert.strictEqual(
            convert(funcEditor, "print('{@} {text}:', {text})", {
                "prints.addCustomMessage": "%F",
            }),
            "print('foo {text}:', {text})"
        );
    });
});

suite("SelectedText hover", () => {
    async function hoverText(line: string, character: number): Promise<string[] | null> {
        const editor = await openEditor(line);
        placeCursor(editor, 0, character);
        return new SelectedText(editor).getText();
    }

    test("parent call", async () => {
        assert.deepStrictEqual(await hoverText("y = foo.bar", 9), ["foo.bar"]);
    });

    test("parent call inside function argument", async () => {
        assert.deepStrictEqual(await hoverText("x = func(obj.attr)", 14), ["obj.attr"]);
    });

    test("parent call through a call with arguments", async () => {
        assert.deepStrictEqual(await hoverText("x = foo(a, b).bar", 15), ["foo(a, b).bar"]);
    });
});

suite("SelectedText selection", () => {
    test("swaps quotes in each selected statement", async () => {
        const editor = await openEditor("d['k'], e['j']\n");
        editor.selection = new vscode.Selection(0, 0, 0, 14);
        assert.deepStrictEqual(new SelectedText(editor).getText(), ['d["k"]', 'e["j"]']);
    });
});

suite("documentParser", () => {
    const settings = () => vscode.workspace.getConfiguration("pythonEasyPrint");

    teardown(async () => {
        await settings().update(
            "prints.customSymbol",
            undefined,
            vscode.ConfigurationTarget.Global
        );
    });

    test("finds only extension prints", async () => {
        const editor = await openEditor("print('🐛 x:', x)\nprint('x')\n");
        assert.deepStrictEqual(documentParser(editor).map((l) => l.range.start.line), [0]);
    });

    test("default symbol also finds old default", async () => {
        const editor = await openEditor("print('➡ x:', x)\nprint('🐛 y:', y)\n");
        assert.deepStrictEqual(documentParser(editor).map((l) => l.range.start.line), [0, 1]);
    });

    test("custom symbol ignores old default", async () => {
        await settings().update("prints.customSymbol", "👉", vscode.ConfigurationTarget.Global);
        const editor = await openEditor("print('➡ x:', x)\nprint('👉 y:', y)\n");
        assert.deepStrictEqual(documentParser(editor).map((l) => l.range.start.line), [1]);
    });

    test("regex characters in custom symbol", async () => {
        await settings().update("prints.customSymbol", ".", vscode.ConfigurationTarget.Global);
        const editor = await openEditor("print('. x:', x)\nprint('a x:', x)\n");
        assert.deepStrictEqual(documentParser(editor).map((l) => l.range.start.line), [0]);
    });
});
