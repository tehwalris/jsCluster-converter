#!/bin/bash
node --use-strict index.js -- ./data/jsCluster-client-log\[tag_$1\]*.jclog ./data/jsCluster-monitor-log\[tag_$1\]*.jclog  out.csv
node --use-strict index.js -- ./data/jsCluster-monitor-log\[tag_$1\]*.jclog  out.csv
