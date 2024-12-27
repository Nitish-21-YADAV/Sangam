const {Schema,model} = require('mongoose')

const MeetingSchema = new Schema ({
    userId :{type:String
    },
    email :{type:String},
    meetingCode:{
        type:String,
        required:true
    },
    date:{type:Date,default:Date.now,required:true}
});

const MeetingModel = new model('meeting',MeetingSchema);

module.exports={MeetingModel}