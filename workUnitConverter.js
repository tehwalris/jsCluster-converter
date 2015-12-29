var _ = require('lodash');

class WorkUnitConverter {
  constructor (input) {
    this.input = input;
  }

  convert () {
    this.input = _.indexBy(this.input, (data) => data.metadata.source);
    this.tasks = {};
    this._convertMonitorData();
    this._convertToCSV();
    return this.output;
  }

  _convertMonitorData () {
    _.forEach(this.input.monitor.data.logs, (logEntry) => {
      if(_.get(logEntry, 'data.type') != 'taskComplete')
        return;
      this.tasks[logEntry.data.uuid] = {
        workUnitTimeLogs: logEntry.data.workUnitTimeLogs
      };
    });
  }

  _convertToCSV () {
    var fields = [
      'task',
      'workUnit',
      'workUnitTimeLog.send',
      'workUnitTimeLog.receive',
      'workUnitTimeLog.start',
      'workUnitTimeLog.endBind',
      'workUnitTimeLog.end'
    ];
    var separator = ', ';
    this.output = fields.join(separator);
    _.forEach(this.tasks, (task, uuid) => {
      _.forEach(task.workUnitTimeLogs, (workUnitTimeLog, workUnitUUID) => {
        var rowData = {
          task: uuid,
          workUnit: workUnitUUID,
          workUnitTimeLog: _.mapValues(_.indexBy(workUnitTimeLog, 'event'), 'time')
        };
        this.output += '\n';
        _.forEach(fields, (field, i) => {
          this.output += (i ? separator : '') + _.get(rowData, field);
        });
      });
    });
  }
}


function convert (input) {
  var workUnitConverter = new WorkUnitConverter(input);
  return workUnitConverter.convert();
}

module.exports = convert;
