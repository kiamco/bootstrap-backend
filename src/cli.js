import arg from "arg";
import inquirer from "inquirer";
import { createProject } from './main.js';
import { exec } from 'child_process';
import chalk from 'chalk';
import slash from 'slash';


'usestrict';

const parseArgToOptions = rawargs => {
    const args = arg({
        "--yes": Boolean,
        "--git": Boolean,
        "--new": Boolean,
        "-n": "--new",
        "-g": "--git",
        "-y": "--yes"
    }, {
        argv: rawargs.slice[2]
    });

    return {
        skipPromts: args['--yes'] || false,
        git: args['--git'] || false,
        new: args['--new'] || false,
        template: args._[0]
    }
};

const promptForMissingOptions = async(options) => {
    const defaultTemplate = 'postgress';
    const questions = [];

    if (options.skipPromts) {
        return {
            ...options,
            template: options.template || defaultTemplate
        };
    }

    if (!options.template) {
        questions.push({
            type: 'list',
            name: 'template',
            message: "Please choose what database are you using",
            choices: ['Postgress', 'MongoDb (in development)', 'MySql (in development)'],
            default: defaultTemplate
        })
    }

    if (!options.git) {
        questions.push({
            type: 'confirm',
            name: 'git',
            message: 'Initialize a git repo',
            default: false
        });
    }

    if (!options.new) {
        questions.push({
            type: 'input',
            name: 'new',
            message: 'create a new directory or use current directory',
            default: slash(process.cwd())
        })
    }

    const answers = await inquirer.prompt(questions);

    return {
        ...options,
        template: options.template || answers.template,
        git: options.git || answers.git,
        directory: options.new || answers.new
    }
};

const cli = async(args) => {
    let options = parseArgToOptions(args);
    options = await promptForMissingOptions(options);
    console.log(options);
    await createProject(options)

    console.log(chalk.blue("npm init"))
    exec('npm init -y', {
            cwd: process.cwd()
        },
        (err, stdout, stderr) => {
            if (err) {
                console.error('%s unable to install dependencies', chalk.red.bold('ERROR'));
                process.exit(1);
            }
            console.log('stdout:', stdout);
            console.log('stderr:', stderr);
        });

    // console.log(chalk.blue("installing dependecies"))
    // exec(`npm install`, {
    //         cwd: slash(process.cwd())
    //     },
    //     (err, stdout, stderr) => {
    //         if (err) {
    //             console.error('%s unable to install dependencies', chalk.red.bold('ERROR'));
    //             process.exit(1);
    //         }
    //         console.log('stdout:', stdout);
    //         console.log('stderr:', stderr);
    //         console.log('%s Dependecies installed', chalk.green.bold('DONE'));

    //     });

    // console.log('%s Dependecies updating', chalk.green.bold('UPDATE'));
    // exec(`npm update`, {
    //         cwd: slash(process.cwd())
    //     },
    //     (err, stdout, stderr) => {
    //         if (err) {
    //             console.error('%s unable to install dependencies', chalk.red.bold('ERROR'));
    //             process.exit(1);
    //         }
    //         console.log('stdout:', stdout);
    //         console.log('stderr:', stderr);
    //         console.log('%s Dependecies installed', chalk.green.bold('UPDATED'));

    //     });

}


module.exports = { cli }