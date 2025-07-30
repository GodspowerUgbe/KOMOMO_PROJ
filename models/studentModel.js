const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    pass: {
        type: String,
        required: true
    },
    telNumber: {
        type: String
    },
    regNumber:{
        type:String
    },
    courses:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Course'
    }],
    
    refreshToken: String,
    
});

module.exports = mongoose.model('Student', studentSchema);
