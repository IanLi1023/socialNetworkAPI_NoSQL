const { Schema, model } = require('mongoose');
const { isEmail } = require('validator');
const moment = require('moment');

const UserSchema = new Schema({
    username: {
        type: String,
        trim: true,
        unique: true,
        required: [true, 'Username is required and must be a minimum of 4 and maximum of 8 characters'],
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'User email address required'],
        trim: true,
        validate: {
            validator: function (value) {
                return /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(value);
            },
            message: function (userObject) {
                return `${userObject.email} is not a valid email address`;
            },
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => moment(createdAtVal).format('MMM DD, YYYY [at] hh:mm:a')
    },
    thoughts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
},
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    });

UserSchema.virtual('friendCount').get(function () {
    return this.friends.length;
});

const User = model('User', UserSchema);

module.exports = User;