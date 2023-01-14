let mongoose = require("mongoose");

//データベースの設計図
let Schema = mongoose.Schema;

//BBSのログのデータ
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
    threadid: {type: String, default: ""} //根の_id
});

// bbs ログインスタンスの URL 用 Virtual
BBSLogModelSchema.virtual("url").get(function(){
    return "/bbs/" + this.bbsName;
})

module.exports = mongoose.model("BBSLogModel", BBSLogModelSchema);