# 1. Python Easy Print

<!-- [![Codacy Badge](https://app.codacy.com/project/badge/Grade/1d2406e640f647978438e8634f4f7df3)](https://www.codacy.com/gh/sisoe24/Python-Easy-Print/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=sisoe24/Python-Easy-Print&amp;utm_campaign=Badge_Grade)
[![Codacy Badge](https://app.codacy.com/project/badge/Coverage/1d2406e640f647978438e8634f4f7df3)](https://www.codacy.com/gh/sisoe24/Python-Easy-Print/dashboard?utm_source=github.com&utm_medium=referral&utm_content=sisoe24/Python-Easy-Print&utm_campaign=Badge_Coverage)
[![DeepSource](https://deepsource.io/gh/sisoe24/Python-Easy-Print.svg/?label=active+issues&show_trend=true&token=30uB5oEZbccV2AOoOX7AgXAT)](https://deepsource.io/gh/sisoe24/Python-Easy-Print/?ref=repository-badge) -->

[![vscode-marketplace](https://img.shields.io/badge/vscode-marketplace-blue)](https://marketplace.visualstudio.com/items?itemName=virgilsisoe.python-easy-print)
[![vscode-version](https://img.shields.io/visual-studio-marketplace/v/virgilsisoe.python-easy-print)](https://marketplace.visualstudio.com/items?itemName=virgilsisoe.python-easy-print&ssr=false#version-history)
[![vscode-installs](https://img.shields.io/visual-studio-marketplace/i/virgilsisoe.python-easy-print)](https://marketplace.visualstudio.com/items?itemName=virgilsisoe.python-easy-print)
[![vscode-ratings](https://img.shields.io/visual-studio-marketplace/r/virgilsisoe.python-easy-print)](https://marketplace.visualstudio.com/items?itemName=virgilsisoe.python-easy-print&ssr=false#review-details)
[![vscode-last-update](https://img.shields.io/visual-studio-marketplace/last-updated/virgilsisoe.python-easy-print)](https://marketplace.visualstudio.com/items?itemName=virgilsisoe.python-easy-print)

[![openvsx-marketplace](https://img.shields.io/badge/openvsx-marketplace-C160EF)](https://open-vsx.org/extension/virgilsisoe/python-easy-print)
[![openvsx-version](https://img.shields.io/open-vsx/v/virgilsisoe/python-easy-print?label=version)](https://open-vsx.org/extension/virgilsisoe/python-easy-print/changes)
[![openvsx-downloads](https://img.shields.io/open-vsx/dt/virgilsisoe/python-easy-print)](https://open-vsx.org/extension/virgilsisoe/python-easy-print)
[![openvsx-rating](https://img.shields.io/open-vsx/rating/virgilsisoe/python-easy-print)](https://open-vsx.org/extension/virgilsisoe/python-easy-print/reviews)

Quick Commands to generate Python's most useful prints in Visual Studio Code.

- [1. Python Easy Print](#1-python-easy-print)
  - [1.1. Features](#11-features)
  - [1.2. How to use](#12-how-to-use)
  - [1.3. Commands \& Key bindings](#13-commands--key-bindings)
  - [1.4. Extension Settings](#14-extension-settings)
  - [1.6. Example Key Bindings](#16-example-key-bindings)
  - [1.7. Note](#17-note)
  - [1.7. Known Issues](#17-known-issues)
  - [1.8 Demo](#18-demo)

## 1.1. Features

- Commands for print statements: `dir`, `type`, `repr`, `help`, `id` and basic `print`.
- Commands for logging statements: `debug`, `info`, `warning`, `error`, and `critical`.
- Personalize each command with text or default placeholders.
- Commands can be activated by text selection or by hovering the cursor over.
- Quickly jump between prints made by the extension.
- Custom command.
- Comment, uncomment and delete statements made by the extension.
- Postfix completions: type `variable.print` or any other available statement.


## 1.2. How to use

Manually select a piece of text or hover over it with the cursor and use one of the commands provided.

![Usage](https://raw.githubusercontent.com/sisoe24/Python-Easy-Print/main/images/print.gif)

## 1.3. Commands & Key bindings

> **NOTE**: The extension could remove the default key bindings in future versions to avoid shortcut conflicts.

All commands are available by opening the Command Palette (`Command+Shift+P` on macOS and `Ctrl+Shift+P` on Windows/Linux) and typing: `Python EasyPrint...`

| Command ID                            | Shortcut         |
| ------------------------------------- | ---------------- |
| `python-easy-print.easyPrint`         | `ctrl+shift+l p` |
| `python-easy-print.easyPrintDir`      | `ctrl+shift+l d` |
| `python-easy-print.easyPrintType`     | `ctrl+shift+l t` |
| `python-easy-print.easyPrintRepr`     | `ctrl+shift+l r` |
| `python-easy-print.easyPrintId`       | `ctrl+shift+l i` |
| `python-easy-print.easyHelp`          |                  |
| `python-easy-print.easyCustom`        | `ctrl+shift+l c` |
| `python-easy-print.easyJumpNext`      | `ctrl+shift+l j` |
| `python-easy-print.easyJumpPrevious`  | `ctrl+shift+l k` |
| `python-easy-print.commentPrintLines` |                  |
| `python-easy-print.deletePrintLines`  |                  |
| `python-easy-print.easyLogDebug`      |                  |
| `python-easy-print.easyLogInfo`       |                  |
| `python-easy-print.easyLogWarning`    |                  |
| `python-easy-print.easyLogError`      |                  |
| `python-easy-print.easyLogCritical`   |                  |

- The main shortcut to remember is `ctrl+shift+l`, plus the initial letter of the action you want to execute: `p` for `print`, `d` for `dir`, `t` for `type`, `c` for custom, etc.
- Every command can be re-assigned to a new shortcut.(see [Key Bindings for Visual Studio Code](https://code.visualstudio.com/docs/getstarted/keybindings) for more information). See [Example Key Bindings](#16-example-key-bindings) for more shortcuts examples

## 1.4. Extension Settings

- `pythonEasyPrint.prints.addCustomMessage`: `string`

  Customize the print message by adding some extra information with some text or by using one of the placeholders provided:

  - `%f`: File name.
  - `%l`: Line number.
  - `%F`: Function parent.
  - `%w`: Relative path of the active file from workspace root.

  Examples:
  - VS Code friendly terminal hyperlink: `%w:%l`

- `pythonEasyPrint.prints.useDoubleQuotes`: `boolean`

    If `true`, the print statement will use double quotes instead of single quotes.

- `pythonEasyPrint.multipleStatements`: `boolean`

  If `true`, when _manually selecting_ multiple statements (e.g., `foo, bar`), print each one individually.

- `pythonEasyPrint.printToNewLine`: `boolean`

  If `true`, it will insert a newline character inside the print

- `pythonEasyPrint.customSymbol`: `string`

  Modify the default Unicode symbol for the prints. It could be an emoji: 👉 (as symbol representation, not the Unicode code point).

- `pythonEasyPrint.customStatement`: `string`

  A custom statement you can use with the `Python EasyPrint: custom` command. In addition to the placeholders mentioned in _Add Custom Message_, the following two placeholders are be available:

  - `{text}`: The selected/hover text.
  - `{symbol}`: The Unicode character.

  Examples:

  - `print('{symbol} {text} ->', {text}, '<-')`
  - `print('─' * 50, '\n┌─ %w:%l - {text}\n└─', {text})`
  - `customFunction({text})`

- `pythonEasyPrint.hover.includeParentCall`: `boolean`

    If `true`, when hovering over a word (e.g., hovering over `bar` of `foo.bar`), include the parent/s to the print.

- `pythonEasyPrint.hover.includeParentheses`: `boolean`

    If `true`, when hovering over a word (e.g., hovering over `bar` of `bar(foo)`), include the function parentheses to the print.

- `pythonEasyPrint.logging.useRepr`: `boolean`

    If `true`, the log command will include the `repr` method into its statement:

    ```py
    logging.debug("name: %s", repr(name))
    ```

- `pythonEasyPrint.logging.customLogName`: `string`

    Specify a different logging instance name for the log commands. If empty will default to `logging`. For example, specifying `LOGGER` as a value will result in:

    ```py
    LOGGER.debug("name: %s", name)
    ```

## 1.6. Example Key Bindings

Prints

```json
[
    {
        "key": "ctrl+shift+l p",
        "command": "python-easy-print.easyPrint",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+shift+l t",
        "command": "python-easy-print.easyPrintType",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+shift+l r",
        "command": "python-easy-print.easyPrintRepr",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+shift+l d",
        "command": "python-easy-print.easyPrintDir",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+shift+l h",
        "command": "python-easy-print.easyHelp",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+shift+l i",
        "command": "python-easy-print.easyPrintId",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+shift+l c",
        "command": "python-easy-print.easyCustom",
        "when": "editorTextFocus"
    }
]
```

Logging

```json
[
    {
        "key": "ctrl+alt+l d",
        "command": "python-easy-print.easyLogDebug",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+alt+l i",
        "command": "python-easy-print.easyLogInfo",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+alt+l w",
        "command": "python-easy-print.easyLogWarning",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+alt+l e",
        "command": "python-easy-print.easyLogError",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+alt+l c",
        "command": "python-easy-print.easyLogCritical",
        "when": "editorTextFocus"
    }
]
```

Document

```json
[
    {
        "key": "ctrl+shift+l j",
        "command": "python-easy-print.easyJumpNext",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+shift+l k",
        "command": "python-easy-print.easyJumpPrevious",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+shift+l c",
        "command": "python-easy-print.commentPrintLines",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+shift+l x",
        "command": "python-easy-print.deletePrintLines",
        "when": "editorTextFocus"
    }
]
```

## 1.7. Note

The commands `Python EasyPrint: print` and `Python EasyPrint: custom` can be
executed on non-Python files, as long as the syntax is supported (e.g., `Lua`).

## 1.7. Known Issues

- When using the delete or comment commands, the extension will ignore the `help` statement and the `custom` statement.
- Temporary removed the test suite

## 1.8 Demo

Logging

![Logging](/images/logging.gif)

Comment, Uncomment & Delete

![DocumentExtras](https://raw.githubusercontent.com/sisoe24/Python-Easy-Print/main/images/comment_uncomment_delete.gif)

Vscode Terminal Hyperlink

![VscodeTerminalHyperlink](https://raw.githubusercontent.com/sisoe24/Python-Easy-Print/main/images/vscode_friendly2.gif)

Extra Selections

![extraSelections](https://raw.githubusercontent.com/sisoe24/Python-Easy-Print/main/images/extra_selections.gif)
