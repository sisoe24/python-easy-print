type Statement = {
    command: string;
    statement: string;
};

enum PrintStatements {
    print = "print",
    type = "type",
    dir = "dir",
    repr = "repr",
    len = "len",
    help = "help",
    id = "id",
    custom = "custom",
}

const PRINT_STATEMENTS: Record<PrintStatements, Statement> = {
    [PrintStatements.print]: {
        command: "python-easy-print.easyPrint",
        statement: "print('{symbol} {@} {text}:', {text})",
    },
    [PrintStatements.type]: {
        command: "python-easy-print.easyPrintType",
        statement: "print('{symbol} {@} {text} type:', type({text}))",
    },
    [PrintStatements.dir]: {
        command: "python-easy-print.easyPrintDir",
        statement: "print('{symbol} {@} {text} dir:', dir({text}))",
    },
    [PrintStatements.repr]: {
        command: "python-easy-print.easyPrintRepr",
        statement: "print('{symbol} {@} {text} repr:', repr({text}))",
    },
    [PrintStatements.id]: {
        command: "python-easy-print.easyPrintId",
        statement: "print('{symbol} {@} {text} id:', id({text}))",
    },
    [PrintStatements.len]: {
        command: "python-easy-print.easyPrintLen",
        statement: "print('{symbol} {@} {text} len:', len({text}))",
    },
    [PrintStatements.help]: {
        command: "python-easy-print.easyHelp",
        statement: "help({text})",
    },
    [PrintStatements.custom]: {
        command: "python-easy-print.easyCustom",
        statement: "{@}",
    },
};

enum LogStatements {
    debug = "debug",
    info = "info",
    warning = "warning",
    error = "error",
    critical = "critical",
}

const LOG_STATEMENTS: Record<LogStatements, Statement> = {
    [LogStatements.debug]: {
        command: "python-easy-print.easyLogDebug",
        statement: "{logger}.debug('{text}: %s', {#text})",
    },
    [LogStatements.info]: {
        command: "python-easy-print.easyLogInfo",
        statement: "{logger}.info('{text}: %s', {#text})",
    },
    [LogStatements.warning]: {
        command: "python-easy-print.easyLogWarning",
        statement: "{logger}.warning('{text}: %s', {#text})",
    },
    [LogStatements.error]: {
        command: "python-easy-print.easyLogError",
        statement: "{logger}.error('{text}: %s', {#text})",
    },
    [LogStatements.critical]: {
        command: "python-easy-print.easyLogCritical",
        statement: "{logger}.critical('{text}: %s', {#text})",
    },
};

export const PRINT_COMMANDS = {
    ...PRINT_STATEMENTS,
    ...LOG_STATEMENTS,
};

export const DOCUMENT_COMMANDS = {
    comment: "python-easy-print.commentPrintLines",
    delete: "python-easy-print.deletePrintLines",
    jumpPrevious: "python-easy-print.easyJumpPrevious",
    jumpNext: "python-easy-print.easyJumpNext",
};
