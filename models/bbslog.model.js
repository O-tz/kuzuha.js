let mongoose = require("mongoose");

//データベースの設計図
let Schema = mongoose.Schema;

let BBSLogModelSchema = new Schema({
    content: String,
    name: {type: String, default: '　'},
    date: Date,
    title: {type: String, default: '　'},
    address: {type: String, default: ""},
    /*
    parent: {type: String, default: ""},
    childs: {type: String, default: ""}
    */
    threadid: {type: String, default: ""}, //根の_id
    parentId: {type: String, default: ""}
});


module.exports = mongoose.model("BBSLogModel", BBSLogModelSchema);