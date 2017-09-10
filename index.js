#!/usr/bin/env node

"use strict";

const chalk             = require('chalk');
const clear             = require('clear');
const CLI               = require('clui');
const figlet            = require('figlet');
const inquirer          = require('inquirer');
const Preferences       = require('preferences');
const Spinner           = CLI.Spinner;
const GitHubApi         = require('github');
const _                 = require('lodash');
const touch             = require('touch');
const fs                = require('fs');
const program           = require('commander');
const updateNotifier    = require("update-notifier");
const cmd               = require('node-cmd');
const rimraf            = require('rimraf');
const emoji             = require('node-emoji');

const pkg               = require('./package.json');
const files             = require('./lib/files');
const commands          = process.argv;

const repositoriesPathHttpsOfZerw = {
    'Normal'    : 'https://github.com/vennet-engineering/zerw-react.git',
    'Redux'     : 'https://github.com/vennet-engineering/zerw-react-redux.git',
    'Mobx'      : 'https://github.com/vennet-engineering/zerw-react-mobx.git'
};

updateNotifier({packageName: pkg.name, packageVersion: pkg.version, updateCheckInterval:1000}).notify();

clear();
console.log(
  chalk.green(
    figlet.textSync('Zerw Cli', { horizontalLayout: 'full' })
  ),
  chalk.red(`\n React scaffolding tool, made with ${emoji.emojify(':heart:')}`),
  chalk.yellow(`\n Version: ${pkg.version} \n\n`)
);

var questions = [
    {
        name: 'finalpath',
        type: 'input',
        message: 'Enter path where you want to add the project react:',
        default: process.cwd(),
        validate: function(value) {
            if (value.length) {
                return true;
            } else {
                return 'Please enter your final path:';
            }
        }
    },
    {
        name: 'architecture',
        type: 'list',
        choices: ['Redux', 'Mobx', 'Normal'],
        message: 'Choose the architecture for your project react:',
        default: process.cwd(),
        validate: function(value) {
            if (value.length) {
                return true;
            } else {
                return 'Please enter your final path:';
            }
        }
    }
];

var countdown = new Spinner('', ['⣾','⣽','⣻','⢿','⡿','⣟','⣯','⣷']);

inquirer.prompt(questions).then((answers) => {
    countdown.start();
    countdown.message(chalk.magenta('Downloading React Chassis...'));

    var localPath = `${answers.finalpath}/zerw-react`;
    if(files.directoryExists(localPath)) {
        console.log(`The folder ${localPath} already exist`);
        process.exit();
        return false;
    }

    cmd.get(
        `git clone ${repositoriesPathHttpsOfZerw[answers.architecture]} ${localPath}`,
        (err, data, stderr) => {
            if (!err) {
                rimraf(`${localPath}/.git`, () => {

                    countdown.message(chalk.magenta('The Zerw React was created correctly.'));
                    countdown.message(chalk.magenta('Installing node packages necessary...'));

                        cmd.get(
                            `cd ${localPath}
                             npm install`,
                            (err, data, stderr) => {
                                if (!err) {
                                    countdown.stop();
                                    fs.unlinkSync(`${localPath}/package-lock.json`);
                                    console.log(chalk.green('All node packages was installed.'));
                                } else {
                                    console.log('there was a error', err);
                                    countdown.stop();
                                }
                            }
                        );

                });
            } else {
                console.log('there was a error', err);
                countdown.stop();
            }
        }
    );

});
