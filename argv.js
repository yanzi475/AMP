'use strict';

const argv = require('yargs')
  .usage('Usage: $0 <command> [options]')
  .command('app', 'run  app in local Chrome (--ios, --android)')
  .command('init', 'init a brand new web-based project')
  .command('ui', 'build for UI development')
  .command('demo', 'build for UI deploy to demo site')
  .command('csslint', 'lint the css')
  .command('dev', 'build for development')
  .command('dev-srv', 'local API server (-p port || 3002, --no)')
  .command('eslint', 'lint the js')
  .command('e2e', 'run e2e test')
  .command('sit', 'build SIT release (--major, --minor, --patch(default))')
  .command('ci', 'run CI job for SIT only (-p \'p1=v1&p2=v2\')')
  .command('prod', 'build PROD release and copy to -wm-res, PROD only')
  .command('verify', 'verify the deployment of both SIT & PROD')
  .demand(1)
  .epilogue('http://tnpm.oa.com/package/@tencent/')
  .argv;

module.exports = argv;
