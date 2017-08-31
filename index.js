#!/usr/bin/env node

"use strict";

var chalk       = require('chalk');
var clear       = require('clear');
var CLI         = require('clui');
var figlet      = require('figlet');
var inquirer    = require('inquirer');
var Preferences = require('preferences');
var Spinner     = CLI.Spinner;
var GitHubApi   = require('github');
var _           = require('lodash');
var git         = require('simple-git')();
var touch       = require('touch');
var fs          = require('fs');
var program = require('commander');
var updateNotifier = require("update-notifier");

var pkg = require("./package.json");
var files = require('./lib/files');
var commands = process.argv;

updateNotifier({packageName: pkg.name, packageVersion: pkg.version, updateCheckInterval:1000}).notify();

clear();
console.log(
  chalk.magenta(
    figlet.textSync('RC Cli', { horizontalLayout: 'full' })
  ),
  chalk.red('\n React Chassis tool\n\n')
);

function getGithubCredentials(callback) {
  var questions = [
    {
      name: 'finalpath',
      type: 'input',
      message: 'Enter your final path for your project react:',
      default: files.getCurrentDirectoryBase(),
      validate: function( value ) {
        if (value.length) {
          return true;
        } else {
          return 'Please enter your final path:';
        }
      }
    }
  ];

  inquirer.prompt(questions).then(callback);
}

getGithubCredentials(function(){
  console.log("callback", arguments);
  var status = new Spinner('Authenticating you, please wait...');
  status.start();
  //status.stop();
});

program
.version(pkg.version)
.command('gen [directory]')
.description('Select directory ')
.option('-l, --list [list]', 'list of customers in CSV file')
.parse(commands);

console.log(program.g);
process.exit();

if (files.directoryExists('.git')) {
  console.log(chalk.red('Already a git repository!'));
  process.exit();
}

module.exports = {
  getCurrentDirectoryBase : function() {
    return path.basename(process.cwd());
  },
  directoryExists : function(filePath) {
    try {
      return fs.statSync(filePath).isDirectory();
    } catch (err) {
      return false;
    }
  }
};
