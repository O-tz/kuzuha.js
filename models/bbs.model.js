const express = require("express");
let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let date = new Date(2023, 1, 8);

//BBS本体のデータ
let BBSModelSchema = new Schema({
    name: {type: String, default: 'ヽ(´ー｀)ノ'},
    foundedDate: {type: Date, default: date},
    logSave: {type: Number, default: 200},
    msgDisp: {type: Number, default: 20},
    hostAddress: {type: String, default: "https://kuzuha-js.onrender.com"},
    mailAddress: {type: String, default: "no@mail.adress.com"}
});

// bbs インスタンスの URL 用 Virtual
BBSModelSchema.virtual("url").get(function(){
    return "/bbs/" + BBSModelSchema.name;
})

// モデルのエクスポート
module.exports = mongoose.model("BBSModel", BBSModelSchema);