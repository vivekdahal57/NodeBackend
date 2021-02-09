/**
 * Created by i82325 on 5/30/2019.
 */
const UserModel = require('./users.model');
const crypto = require('crypto');
const nodeMailer = require('nodemailer');

exports.insert = (req, res) => {
    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
    req.body.password = salt + "$" + hash;
    UserModel.createUser(req.body).catch((error) => {
        if (error.name === 'MongoError' && error.code === 11000) {
            res.status(201).send({error: 'Username should not be duplicate!!'});
        }
    }).then((result) => {
        res.status(201).send({id: result._id});
    });
};

exports.list = (req, res) => {
    let limit = req.query.limit && req.query.limit <= 10000 ? parseInt(req.query.limit) : 10;
    let page = 0;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    UserModel.findALL(limit, page)
        .then((result) => {
            res.status(200).send(result);
        })
};

exports.getById = (req, res) => {
    UserModel.findById(req.params.userId)
        .then((result) => {
            res.status(200).send(result);
        });
};

exports.getByEmail = (req, res) => {
    UserModel.findByEmail(req.params.email)
        .then((result) => {
            let transporter = nodeMailer.createTransport({
                host: 'smtp.gmail.com',
                port: '587',
                auth: {
                    user: 'vivek.dahal157@gmail.com',
                    pass: 'victor_dahal57'
                },
                secureConnection: 'false',
                tls: {
                    ciphers: 'SSLv3'
                }
            });
            let mailOptions = {
                from: '"no-reply" <foo@example.com>', // sender address
                to: 'vivek.dahal57@gmail.com', // list of receivers
                subject: 'Subject', // Subject line
                text: 'Body', // plain text body
                html: '<b>NodeJS Email Tutorial</b>' // html body
            };

            transporter.sendMail(mailOptions, function (err, info) {
                if (err)
                    console.log(err)
                else
                    console.log(info);
            });
            res.status(200).send({message: '' + result});
        });
};

exports.updateById = (req, res) => {
    if (req.body.password) {
        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
        req.body.password = salt + "$" + hash;
    }

    UserModel.updateUser(req.params.userId, req.body).catch((error) => {
        if (error.name === 'MongoError' && error.code === 11000) {
            res.status(201).send({error: 'Username should not be duplicate!!'});
        }
    })
        .then((result) => {
            res.status(204).send({result});
        });

};

exports.updatePasswordById = (req, res) => {
    if (req.body.newPassword && req.body.oldPassword) {
        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac('sha512', salt).update(req.body.newPassword).digest("base64");
        req.body.newPassword = salt + "$" + hash;

        UserModel.findById(req.params.userId).then((response) => {
            let passwordFields = response.password.split('$');
            salt = passwordFields[0];
            hash = crypto.createHmac('sha512', salt).update(req.body.oldPassword).digest("base64");
            if (hash === passwordFields[1]) {
                response.password = req.body.newPassword;
                UserModel.updateUser(req.params.userId, response).catch((error) => {
                    if (error.name === 'MongoError' && error.code === 11000) {
                        res.status(201).send({error: 'Username should not be duplicate!!'});
                    }
                    res.status(404).send({error: error});
                })
                    .then(() => {
                        res.status(201).send({message: 'New Password Updated!!!'});
                    });
            } else {
                res.status(201).send({error: 'Old Password did not match!!!'})
            }


        });
    }
};


exports.removeById = (req, res) => {
    UserModel.deleteById(req.params.userId)
        .then((result) => {
            res.status(204).send({result});
        });
};