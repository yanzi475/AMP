'use strict';

const path = require('path'),
    chalk = require('chalk'),
    fse = require('fs-extra'),
    chokidar = require('chokidar'),
    cors = require('cors'),
    enableDestroy = require('server-destroy'),
    jsonServer = require('json-server'),
    argv = require('../plug/argv');

const built_in_db = require('./db.json'), // built-in database
    built_in_r = require('./r.json'), // built-in router
    local_db_file = path.join(process.cwd(), '/test/db.json'), // project specific database file
    local_r_file = path.join(process.cwd(), '/test/r.json'); // project specific router file

let port = 3002,
    hj_wrap = true, // wrap resp data
    server,
    fixed_db = {}; // in-memory fixed merged database

const getLocalIP = () => {
    let address,
        os = require('os'),
        ifaces = os.networkInterfaces();
    for (let dev in ifaces) {
        let iface = ifaces[dev].filter(details => details.family === 'IPv4' && details.internal === false);
        if (iface.length > 0) {
            address = iface[0].address;
            break;
        }
    }
    return address;
};

const watch = () => {
    console.log('🙈  Watching : Local Data => %s/test/{db,r}.json\n', process.cwd());
    chokidar
        .watch([local_r_file, local_db_file])
        .on('change', () => {
            console.log(chalk.gray('🙏  Restarting...'));
            server.destroy(() => {
                start();
            });
        });
};

const start = () => {
    // load local
    let local_db = {},
        local_r = {};
    try {
        local_db = fse.readJsonSync(local_db_file);
        local_r = fse.readJsonSync(local_r_file);
    } catch (e) {
        console.warn(chalk.red('🙋  Warning : NO Local Data => %s/test/{db,r}.json\n', process.cwd()));
    }

    // merge data
    let db = Object.assign({}, built_in_db, local_db),
        r = Object.assign({}, built_in_r, local_r);
    Object.assign(fixed_db, db);

    // start server
    let app = jsonServer.create();
    // cors
    app.use(cors());
    // res
    let router = jsonServer.router(db);
    router.render = (req, res) => {
        // retrun the fixed data
        let db_data = res.locals.data;
        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH' || req.method === 'DELETE') {
            db_data = fixed_db[req.path.replace('/', '')] || {};
        }
        // wrap for hj
        let res_json = {};
        if (!hj_wrap || req.query._no_hj) {
            // no wrap
            Object.assign(res_json, db_data);
        } else {
            // wrap
            if (db_data.hasOwnProperty('ret_data')) {
                Object.assign(res_json, db_data);
            } else { // wrap for hj
                res_json.ret_data = db_data;
            }
            const _ret_code = req.query._ret_code;
            if (!res_json.hasOwnProperty('ret_code')) {
                res_json.ret_code = '20270000';
            }
            if (_ret_code !== undefined) {
                res_json.ret_code = _ret_code;
            }
        }

        let _status = req.query._status || 200; // http resp status
        if (_status * 1 >= 400) {
            res.sendStatus(_status);
        } else {
            res.json(res_json);
        }
    };
    // server
    app.use(jsonServer.rewriter(r));
    app.use(jsonServer.defaults());
    app.use(router);
    server = app.listen(port, () => {
        console.log(`👏  Running : http://${getLocalIP()}:${port}\n`);
    });
    enableDestroy(server);
};

if (argv._ && argv._[0] === 'dev-srv') {
    console.log(chalk.bold(' Local API Server\n'));
    if (argv.p) {
        port = parseInt(argv.p);
    }
    hj_wrap = !argv.nohj;
    start();
    watch();
}
