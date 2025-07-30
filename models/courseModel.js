const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    resources:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Resource'
    }],
    courseCode:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model('Course', courseSchema);
