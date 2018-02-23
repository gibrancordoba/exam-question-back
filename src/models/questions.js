const mongoose = require('mongoose');

const Options = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, 
    value: { type: String, required: true },
});

const Question = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {type: String, required:true},
    description: { type: String, required: true },
    options: [Options],
    type: { type: mongoose.Schema.Types.ObjectId, ref: 'TypeQuestion', required: true}
});

module.exports = mongoose.model('Question', Question);