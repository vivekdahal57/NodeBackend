/**
 * Created by i82325 on 5/30/2019.
 */
const crypto = require('crypto');
const config = require('../config/env.config');
const jwt = require('jsonwebtoken');

exports.login = (req, res) => {
    try {
        delete req.body.exp;
        let refreshId = req.body.userId + config.jwt_secret;
        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac('sha512', salt).update(refreshId).digest("base64");
        req.body.refreshKey = salt;
        let token = jwt.sign(req.body, config.jwt_secret, {'expiresIn': config.jwt_expiration_in_seconds});
        let b = new Buffer(hash);
        let refresh_token = b.toString('base64');
        res.status(201).send({
            accessToken: token,
            refreshToken: refresh_token,
            permissionLevel:req.body.permissionLevel,
            name: req.body.name,
            id:req.body.userId
        });
    } catch (err) {
        res.status(500).send({
            errors: err + 'Error Generating Access Token',
        });
    }
};

exports.refresh_token = (req, res) => {
    try {
        req.body = req.jwt;
        delete req.body.exp;
        let token = jwt.sign(req.body, config.jwt_secret, {'expiresIn': config.jwt_expiration_in_seconds});
        res.status(201).send({id: token});
    } catch (err) {
        res.status(500).send({errors: err + 'Error Generating Refresh Token'});
    }
};