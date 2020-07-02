const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let categorySchema = new Schema({
    desc: { type: String, unique: true, required: [true, 'El nombre de categoria es necesario'] },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Category', categorySchema);