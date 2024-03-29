import { parse as Parser } from 'ts-command-line-args';
import Chalk from 'chalk';
import Logger from './Logger';

const AvailableInputSources = ['clipboard'] as const;
const ObfuscateOptions = ['emails'] as const;
const Package = require('../../package.json');

export default Parser<CliOptions>({
    source: {
        type: (value: InputSource) => {
            if (!AvailableInputSources.includes(value)) {
                Logger.error(`Oops, ${Chalk.underline(value)} not a supported input source!`);
                Logger.suggestHelp({
                    option: 'source',
                    value: 'clipboard',
                })
                process.exit(22);
            }

            return value;
        },
        alias: 's',
        defaultValue: 'clipboard',
        description: `Whether we should grab text from your clipboard or a file`,
        typeLabel: Chalk.yellowBright(AvailableInputSources.join(', '))
    },
    immediate: {
        type: Boolean,
        alias: 'i',
        defaultValue: false,
        description: 'Skip the confirmation prompt - just push directly to the clipboard and hope for the best! 🙏'
    },
    obfuscate: {
        type: (value: Obfuscate) => {
            if (!ObfuscateOptions.includes(value)) {
                Logger.error(`Oops, ${Chalk.underline(value)} not a supported obfuscate option!`);
                Logger.suggestHelp({ option: 'obfuscate', value: 'emails' });
                process.exit(22);
            }
            return value;
        },
        defaultValue: [],
        alias: 'o',
        multiple: true,
        description: 'Specify whether we should obfuscate the input text',
    },
    help: {
        type: Boolean,
        description: 'Display this prompt - listing all available options.'
    }
}, {
    helpArg: 'help',
    headerContentSections: [
        {
            header: Package.name,
            content: Package.description,
        }
    ]
});

type Obfuscate = Obfuscates[number];
type Obfuscates = typeof ObfuscateOptions;
type InputSource = typeof AvailableInputSources[number];
export interface CliOptions {
    immediate: boolean;
    source: InputSource;
    obfuscate: Obfuscate[],
    help: boolean;
}

