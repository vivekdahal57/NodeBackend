/**
 * Created by i82325 on 5/30/2019.
 */
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/rest-tutorial');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    userName: {type: String, index: {unique: true}},
    password: String,
    permissionLevel: Number
});

userSchema.virtual('id').get(function () {
    return this._id;
});

userSchema.set('toJSON', {
    virtuals: true
});

const User = mongoose.model('Users', userSchema);

exports.findByEmail = (email) => {
    return User.find({email: email});
};

exports.findByUsername = (userName) => {
    return User.find({userName: userName});
};

exports.findById = (id) => {
    return User.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        })
};

exports.createUser = (userData) => {
    const user = new User(userData);
    return user.save();
};

exports.findALL = (perPage, page) => {
    return new Promise((resolve, reject) => {
        User.find()
            .select(['-password'])
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, users) {
                if (err) {
                    reject(err);
                } else {
                    resolve(users);
                }
            })
    })
};

exports.updateUser = (id, userData) => {
    return new Promise((resolve, reject) => {
        User.findById(id, function (err, user) {
            if (err) reject(err);
            for (let i in userData) {
                user[i] = userData[i];
            }

            user.save(function (err, updatedUser) {
                if (err) return reject(err);
                resolve(updatedUser);
            });
        });
    })
};

exports.deleteById = (userId) => {
    return new Promise((resolve, reject) => {
        User.remove({_id: userId}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        })
    })
};
