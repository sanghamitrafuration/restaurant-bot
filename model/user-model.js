const mongoose= require("mongoose");

const userSchema= mongoose.Schema({
    name: { type: String, required: true },
    recipient: { type: Number, required: true },
    phone_number_id: { type: Number, required: true }
})

const UserModel= mongoose.model("user", userSchema);

module.exports= {
    UserModel
}