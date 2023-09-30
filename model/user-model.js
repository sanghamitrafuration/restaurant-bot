const mongoose= require("mongoose");

const userSchema= mongoose.Schema({
    name: { type: String, required: true },
    recipient: { type: Number, required: true },
    phone_number_id: { type: Number, required: true },
    messsage_count: { type: Number, required: true, default: 0 },
    createdAt : { type: Date, default: Date.now()}
})

const UserModel= mongoose.model("user", userSchema);

module.exports= {
    UserModel
}