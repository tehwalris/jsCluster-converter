var _ = require('lodash');
var fs = require("fs");
var argv = require('minimist')(process.argv.slice(2));
var convert = new require('./converter');
var workUnitConvert = new require('./workUnitConverter');

if(argv._.length < 2) {
  quitBadArguments();
  return; 
}

if(argv._.length == 2) {
  var input = [loadInput(argv._[0])];
  writeOutput(argv._[1], workUnitConvert(input));
} else {
  var input = [loadInput(argv._[0]), loadInput(argv._[1])];
  writeOutput(argv._[2], convert(input));
}

//////

function quitBadArguments () {
  console.log('Invalid arguments given.');
  printHelp();
  process.exit(1);
}

function printHelp () {
  console.log('Usage:' +
              ' [command] inputFile1 [inputFile2] outputFile');
}

function loadInput (path) {
  try {
    return JSON.parse(fs.readFileSync(path, "utf8"));
  } catch (e) {
    console.log('Input file could not be opened.');
    console.log(e);
    process.exit(1);
  }
}

function writeOutput (path, data) {
  fs.writeFile(path, data);
  console.log(data);
}

