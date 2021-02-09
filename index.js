/**
 * Created by i82325 on 5/30/2019.
 */
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const console=require('console');
const config= require('./src/config/env.config')
const AuthorizationRouter= require('./src/authorization/routes.config');
const UsersRouter= require('./src/modules/users/routes.config');

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
        return res.send(200);
    } else {
        return next();
    }
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors('*'));

AuthorizationRouter.routesConfig(app);
UsersRouter.routesConfig(app);

app.listen(config.port, function () {
    console.log('app listening at port %s', config.port);
});
