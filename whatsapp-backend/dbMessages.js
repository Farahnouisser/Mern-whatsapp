import mongoose from 'mongoose'
const whatsappSchema = mongoose.Schema({
message : String ,
name : String,
timestamp : String,
received : Boolean,


});
// this is  the collection 

export default mongoose.model("messagecontents", whatsappSchema);