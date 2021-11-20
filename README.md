# Python Easy Print

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/1d2406e640f647978438e8634f4f7df3)](https://www.codacy.com/gh/sisoe24/Python-Easy-Print/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=sisoe24/Python-Easy-Print&amp;utm_campaign=Badge_Grade)
[![Codacy Badge](https://app.codacy.com/project/badge/Coverage/1d2406e640f647978438e8634f4f7df3)](https://www.codacy.com/gh/sisoe24/Python-Easy-Print/dashboard?utm_source=github.com&utm_medium=referral&utm_content=sisoe24/Python-Easy-Print&utm_campaign=Badge_Coverage)
[![DeepSource](https://deepsource.io/gh/sisoe24/Python-Easy-Print.svg/?label=active+issues&show_trend=true&token=30uB5oEZbccV2AOoOX7AgXAT)](https://deepsource.io/gh/sisoe24/Python-Easy-Print/?ref=repository-badge)
[![Last Update](https://img.shields.io/visual-studio-marketplace/last-updated/virgilsisoe.python-easy-print)](https://marketplace.visualstudio.com/items?itemName=virgilsisoe.python-easy-print)

VSCode extension for easy commands of Python most useful prints.

---

**NOTE**: Python 2 developers should start their file with the following declaration or use the included command when using this extension:

```py
# coding: utf-8
from __future__ import print_function
```

More info for [encoding](https://www.python.org/dev/peps/pep-0263/) and [print function](https://docs.python.org/3/library/__future__.html) on the official documentation.

---

- [Python Easy Print](#python-easy-print)
  - [Features](#features)
  - [Commands & Key bindings](#commands--key-bindings)
    - [NOTE](#note)
  - [Extension Settings](#extension-settings)
    - [`pythonEasyPrint.prints.addCustomMessage: string`](#pythoneasyprintprintsaddcustommessage-string)
    - [`pythonEasyPrint.multipleStatements: boolean`](#pythoneasyprintmultiplestatements-boolean)
    - [`pythonEasyPrint.hover.includeParentCall: boolean`](#pythoneasyprinthoverincludeparentcall-boolean)
    - [`pythonEasyPrint.hover.includeParentheses: boolean`](#pythoneasyprinthoverincludeparentheses-boolean)
    - [`pythonEasyPrint.logging.customLogName: string`](#pythoneasyprintloggingcustomlogname-string)
    - [`pythonEasyPrint.logging.useRepr: boolean`](#pythoneasyprintlogginguserepr-boolean)
  - [Known Issues](#known-issues)
  - [Example Key Bindings](#example-key-bindings)
  - [Screenshots](#screenshots)

## Features

- Commands for print statements: `dir`, `type`, `repr`, `help` and basic `print`.
- Commands for logging statements: `debug`, `info`, `warning`, `error` and `critical`
- Commands can be activate by selecting the whole word/s or just by hovering the cursor over.
- Comment, uncomment and delete statements made by extension.
- Quick command to initiate a Python2 file with the declarations needed to use the Python3 `print` and decode `utf-8` unicode characters.

## Commands & Key bindings

---

### NOTE

Default key bindings will be removed in the future version. This is to let the user decide which and what shortcut needs more as with the new logging commands there are too many shortcuts.

---

The main shortcut to remember is `ctrl+shift+l`. Then the initial letter of the action you will like tu execute:

 `p` for `print`, `d` for `dir`, `t` for `type` and so. The only different is `x` for delete

| Description                       | Command ID                              | Key              |
| --------------------------------- | --------------------------------------- | ---------------- |
| Simple `print()`                  | `python-easy-print.easyPrint`           | `ctrl+shift+l p` |
| Print `dir()`                     | `python-easy-print.easyPrintDir`        | `ctrl+shift+l d` |
| Print `type()`                    | `python-easy-print.easyPrintType`       | `ctrl+shift+l t` |
| Print `repr()`                    | `python-easy-print.easyPrintRepr`       | `ctrl+shift+l r` |
| Call `help()`                     | `python-easy-print.easyHelp`            | `ctrl+shift+l h` |
| Comment lines made by extension   | `python-easy-print.commentPrintLines`   | `ctrl+shift+l c` |
| Uncomment lines made by extension | `python-easy-print.uncommentPrintLines` | `ctrl+shift+l u` |
| Delete lines made by extension    | `python-easy-print.deletePrintLines`    | `ctrl+shift+l x` |
| Init Python2 header declaration   | `python-easy-print.easyPrintPy2`        |                  |
| Log `debug`                       | `python-easy-print.easyLogDebug`        |                  |
| Log `info`                        | `python-easy-print.easyLogInfo`         |                  |
| Log `warning`                     | `python-easy-print.easyLogWarning`      |                  |
| Log `error`                       | `python-easy-print.easyLogError`        |                  |
| Log `critical`                    | `python-easy-print.easyLogCritical`     |                  |

MacOS: `ctrl` == `cmd`

All commands are available by opening the Command Palette (`Command+Shift+P` on macOS and `Ctrl+Shift+P` on Windows/Linux) and typing: `Python EasyPrint...`

Every command can be re-assigned to a new shortcut. (see [docs](https://code.visualstudio.com/docs/getstarted/keybindings) for more info)

## Extension Settings

### `pythonEasyPrint.prints.addCustomMessage: string`

Customize the print message by adding some extra information with a custom string or by using one of the placeholder provided:

- `%f`: File name.
- `%l`: Line number.
- `%F`: Function parent.

Example: `Debug - %f - %F line %l -` will result in: `print("➡ DEBUG - test.py - foo line 1 - name :", name))`

### `pythonEasyPrint.multipleStatements: boolean`

If `true`, when manually selecting multiple statements (eg: `foo, bar`), print each statement individually.

### `pythonEasyPrint.hover.includeParentCall: boolean`

If `true`, when hovering over a word (eg. hovering over `bar` of `foo.bar`), include its parent/s to the statement.

### `pythonEasyPrint.hover.includeParentheses: boolean`

If `true`, when hovering over a word (eg. hovering over `bar` of `bar(foo)`), include the function parentheses to the statement.

### `pythonEasyPrint.logging.customLogName: string`

Specify a different log name instance for the log commands. If empty, will default to `logging.debug()`.

Example: specifying `LOGGER` as a custom name will result in the following statements: `LOGGER.debug()`

### `pythonEasyPrint.logging.useRepr: boolean`

If `true`, the log command will include the `repr` method into its statement: `logging.debug("name: %s", repr(name))`.

## Known Issues

- When using the command to delete, the extension will ignore the `help` statement.

## Example Key Bindings

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
        "when": "editorTextFocus && resourceLangId == python"
    },
    {
        "key": "ctrl+shift+l r",
        "command": "python-easy-print.easyPrintRepr",
        "when": "editorTextFocus && resourceLangId == python"
    },
    {
        "key": "ctrl+shift+l d",
        "command": "python-easy-print.easyPrintDir",
        "when": "editorTextFocus && resourceLangId == python"
    },
    {
        "key": "ctrl+shift+l h",
        "command": "python-easy-print.easyHelp",
        "when": "editorTextFocus && resourceLangId == python"
    },
    {
        "key": "ctrl+alt+l d",
        "command": "python-easy-print.easyLogDebug",
        "when": "editorTextFocus && resourceLangId == python"
    },
    {
        "key": "ctrl+alt+l i",
        "command": "python-easy-print.easyLogInfo",
        "when": "editorTextFocus && resourceLangId == python"
    },
    {
        "key": "ctrl+alt+l w",
        "command": "python-easy-print.easyLogWarning",
        "when": "editorTextFocus && resourceLangId == python"
    },
    {
        "key": "ctrl+alt+l e",
        "command": "python-easy-print.easyLogError",
        "when": "editorTextFocus && resourceLangId == python"
    },
    {
        "key": "ctrl+alt+l c",
        "command": "python-easy-print.easyLogCritical",
        "when": "editorTextFocus && resourceLangId == python"
    },
]
```

## Screenshots

<img title="Settings" src="https://github.com/sisoe24/Python-Easy-Print/blob/main/images/example_settings.png?raw=true" width="100%"/>

<img title="HoverOrSelection" src="https://github.com/sisoe24/Python-Easy-Print/blob/main/images/hover_selection.gif?raw=true" width="80%"/>

<img title="Example" src="https://github.com/sisoe24/Python-Easy-Print/blob/main/images/example_statements4.gif?raw=true" width="80%"/>

<img title="CommentUncommentDelete" src="https://github.com/sisoe24/Python-Easy-Print/blob/main/images/comment_uncomment_delete.gif?raw=true" width="90%"/>
