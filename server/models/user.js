const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

let validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} is not a valid role'
};

let Schema = mongoose.Schema;

let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es necesario'],
    },
    email: {
        type: String,
        required: [true, 'El email es necesario'],
        unique: true
    },
    passwd: {
        type: String,
        required: [true, 'La contraseña es necesario'],
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: validRoles
    },
    state: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
});

userSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.passwd;

    return userObject;
};

userSchema.plugin(uniqueValidator, { message: 'El {PATH} {VALUE} ya existe' });


module.exports = mongoose.model('User', userSchema)