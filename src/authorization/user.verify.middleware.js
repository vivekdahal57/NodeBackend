/**
 * Created by i82325 on 5/30/2019.
 */
const crypto = require('crypto');
const UserModel=require('../modules/users/users.model');

exports.hasAuthValidFields = (req, res, next) => {
    let errors = [];
    if (req.body) {
        if (!req.body.userName) {
            errors.push('Missing username field');
        }
        if (!req.body.password) {
            errors.push('Missing password field');
        }
        if (errors.length) {
            return res.status(400).send({errors: errors.join(',')});
        } else {
            return next();
        }
    } else {
        return res.status(400).send({errors: 'Missing email and password fields'});
    }
};

exports.isPasswordAndUserMatch = (req, res, next) => {
    UserModel.findByUsername(req.body.userName)
        .then((user) => {
            if (!user[0]) {
                res.status(404).send({});
            } else {
                let passwordFields = user[0].password.split('$');
                let salt = passwordFields[0];
                let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
                if (hash === passwordFields[1]) {
                    req.body = {
                        userId: user[0]._id,
                        email: user[0].email,
                        userName: user[0].userName,
                        permissionLevel: user[0].permissionLevel,
                        provider: 'email',
                        name: user[0].firstName + ' ' + user[0].lastName,
                    };
                    return next();
                } else {
                    return res.status(400).send({errors: ['Invalid username or password']});
                }
            }
        });
};