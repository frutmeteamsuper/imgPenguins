
// Copyright IBM Corp. 2016. All Rights Reserved.
// Node module: loopback-workspace
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();



app.start = function() {
module.exports = function(app) {
  app.dataSources.files_local.connector.getFilename = function (origFilename, req, res) {
        var origFilename = origFilename.name;
        var parts = origFilename.split('.'),
        extension = parts[parts.length-1];
        var newFilename = (new Date()).getTime()+'_'+parts[parts.length-2]+'.'+extension;
        return newFilename;
  }
};
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
