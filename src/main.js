// const chalk = require('chalk');
// const fs = require('fs');
// const ncp = require('ncp');
// const path = require('path');
// const promisify = require('util').promisify;

import chalk from 'chalk';
import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import { promisify } from 'util';
import slash from 'slash';

const access = promisify(fs.access);
const copy = promisify(ncp);

const copyTemplateFiles = async(options) => {
    return copy(options.templateDirectory, options.targetDirectory, {
        clobber: false
    })
}

export const createProject = async(options) => {
    options = {
        ...options,
        targetDirectory: options.targetDirectory || process.cwd()
    }

    const currentFileUrl =
        import.meta.url;
    const templateDir = path.resolve(
        new URL(currentFileUrl).pathname,
        '../templates',
        options.template.toLowerCase()
    );

    options.templateDirectory =
        templateDir.split('')[0] === "C" ?
        slash(templateDir).slice(3) :
        templateDir;

    try {
        await console.log(templateDir);

        await access(
            templateDir.split("")[0] === "C" ?
            slash(templateDir).slice(3) :
            templateDir,
            fs.constants.R_OK
        );
    } catch (err) {
        console.error('%s Invalid template', chalk.red.bold('ERROR'));
        process.exit(1);
    }

    console.log('Copy project files');
    await copyTemplateFiles(options);

    console.log('%s Project ready', chalk.green.bold('DONE'));
}