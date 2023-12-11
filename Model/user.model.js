import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userModel = new Schema({
    name : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true,
    },
    contact : {
        type : Number,
        required : true,
    },
    avatar : {
        type : String,
        required : null
    },
    status : {
        type : Number,
       default : 1
    },
    createAt : {
        type : Date,
        default : Date.now()
    }
})

export default mongoose.model("Users", userModel)