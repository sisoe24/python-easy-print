type CommandData = {
    command: string;
    formatString: string;
};

enum PrintCommands {
    print = "print",
    type = "type",
    dir = "dir",
    repr = "repr",
    len = "len",
    help = "help",
    id = "id",
    custom = "custom",
}

const PRINT_MAP: Record<PrintCommands, CommandData> = {
    [PrintCommands.print]: {
        command: "python-easy-print.easyPrint",
        formatString: "print('{symbol} {@} {text}:', {text})",
    },
    [PrintCommands.type]: {
        command: "python-easy-print.easyPrintType",
        formatString: "print('{symbol} {@} {text} type:', type({text}))",
    },
    [PrintCommands.dir]: {
        command: "python-easy-print.easyPrintDir",
        formatString: "print('{symbol} {@} {text} dir:', dir({text}))",
    },
    [PrintCommands.repr]: {
        command: "python-easy-print.easyPrintRepr",
        formatString: "print('{symbol} {@} {text} repr:', repr({text}))",
    },
    [PrintCommands.id]: {
        command: "python-easy-print.easyPrintId",
        formatString: "print('{symbol} {@} {text} id:', id({text}))",
    },
    [PrintCommands.len]: {
        command: "python-easy-print.easyPrintLen",
        formatString: "print('{symbol} {@} {text} len:', len({text}))",
    },
    [PrintCommands.help]: {
        command: "python-easy-print.easyHelp",
        formatString: "help({text})",
    },
    [PrintCommands.custom]: {
        command: "python-easy-print.easyCustom",
        formatString: "{@}",
    },
};

enum LogStatements {
    debug = "debug",
    info = "info",
    warning = "warning",
    error = "error",
    critical = "critical",
}

const LOGGING_MAP: Record<LogStatements, CommandData> = {
    [LogStatements.debug]: {
        command: "python-easy-print.easyLogDebug",
        formatString: "{logger}.debug('{text}: %s', {#text})",
    },
    [LogStatements.info]: {
        command: "python-easy-print.easyLogInfo",
        formatString: "{logger}.info('{text}: %s', {#text})",
    },
    [LogStatements.warning]: {
        command: "python-easy-print.easyLogWarning",
        formatString: "{logger}.warning('{text}: %s', {#text})",
    },
    [LogStatements.error]: {
        command: "python-easy-print.easyLogError",
        formatString: "{logger}.error('{text}: %s', {#text})",
    },
    [LogStatements.critical]: {
        command: "python-easy-print.easyLogCritical",
        formatString: "{logger}.critical('{text}: %s', {#text})",
    },
};

export const PRINT_COMMANDS = {
    ...PRINT_MAP,
    ...LOGGING_MAP,
};

export const DOCUMENT_COMMANDS = {
    comment: "python-easy-print.commentPrintLines",
    delete: "python-easy-print.deletePrintLines",
    jumpPrevious: "python-easy-print.easyJumpPrevious",
    jumpNext: "python-easy-print.easyJumpNext",
};
