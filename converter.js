var _ = require('lodash');

class Converter {
  constructor (input) {
    this.input = input;
  }

  convert () {
    this.input = _.indexBy(this.input, (data) => data.metadata.source);
    this.tasks = [];
    this._convertMonitorData();
    this._convertClientData();
    this._convertToCSV();
    return this.output;
  }

  _convertMonitorData () {
    _.forEach(this.input.monitor.data.logs, (logEntry) => {
      if(_.get(logEntry, 'data.type') != 'taskComplete')
        return;
      this.tasks.push({
        uuid: logEntry.data.uuid,
        monitorTimeLog: _.mapValues(_.indexBy(logEntry.data.timeLog, 'event'), 'time')
      });
    });
  }

  _convertClientData () {
    _.forEach(this.input.client.data.reverse(), (logEntry, i) => {
      var task = this.tasks[i];
      task.clientRuntime = logEntry.runtime;
      task.clientSettings = logEntry.settings;
    });
  }

  _convertToCSV () {
    var fields = [
      'clientRuntime',
      'clientSettings.center',
      'clientSettings.range',
      'monitorTimeLog.startTask',
      'monitorTimeLog.startSplit',
      'monitorTimeLog.endSplit',
      'monitorTimeLog.startDistribution',
      'monitorTimeLog.endDistribution',
      'monitorTimeLog.startJoin',
      'monitorTimeLog.endJoin'
    ];
    var separator = ', ';
    this.output = fields.join(separator);
    _.forEach(this.tasks, (task) => {
      this.output += '\n';
      _.forEach(fields, (field, i) => {
        this.output += (i ? separator : '') + _.get(task, field);
      });
    });
  }
}


function convert (input) {
  var converter = new Converter(input);
  return converter.convert();
}

module.exports = convert;
