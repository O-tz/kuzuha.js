let BBSModel = require("../models/bbs.model");
let BBSLogModel = require("../models/bbslog.model");
let bbsInstance = new BBSModel();

const {body, validationResult} = require("express-validator");




let async = require("async");
const { contentSecurityPolicy } = require("helmet");

exports.index = function(req, res){
    res.render("index");
};

exports.bbs = async (req, res) => {
    let limit = bbsInstance.msgDisp;

    let cursor = BBSLogModel.find({}).limit(limit).sort({date: "desc"}).cursor();
    let messages = [];
    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()){
        messages.push(doc);
    }
    res.render("bbs", {
        hostAddress: bbsInstance.hostAddress,
        mailto: "mailto:" + bbsInstance.mailaddress,
        foundeddate: bbsInstance.foundedDate.toDateString(),
        messages: messages,
        mattaritime: null
    });
};

exports.bbsMessagePost = (req, res) => {
    if (req.body.postContent != "") {
        let log = new BBSLogModel({
            name: req.body.postPoster,
            title: req.body.postTitle,
            content: req.body.postContent,
            date: new Date(Date.now()),
            address: req.body.postMailaddress
        });
        log.threadid = log._id.toString();
        log.save((err) => {
            res.redirect("/bbs");
        });
    }else{
        res.redirect("/bbs");
    }
};

exports.bbsNextPage = async (req, res) => {
    let limit = bbsInstance.msgDisp;
    console.log(req.params.since);
    let time = new Date(Number(req.params.since));
    let mattaritime = req.params.mattaritime;
    console.log(mattaritime);
    let cursor = BBSLogModel.find({}).lt("date", time).limit(limit).sort({date: "desc"}).cursor();
    let messages = [];
    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()){
        messages.push(doc);
    }
    console.log(messages);
    res.render("bbs", {
        hostAddress: bbsInstance.hostAddress,
        mailto: "mailto:" + bbsInstance.mailaddress,
        foundeddate: bbsInstance.foundedDate.toDateString(),
        messages: messages,
        mattaritime: mattaritime
    });
};

exports.bbsMattariload = async (req, res) => {
    let limit = bbsInstance.msgDisp;
    let time = new Date(Number(req.params["until"]));
    let cursor = BBSLogModel.find({}).gt("date", time).limit(limit).sort({date: "desc"}).cursor();
    let messages = [];
    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()){
        //console.log(doc);
        messages.push(doc);
    }
    res.render("bbs", {
        hostAddress: bbsInstance.hostAddress,
        mailto: "mailto:" + bbsInstance.mailaddress,
        foundeddate: bbsInstance.foundedDate.toDateString(),
        messages: messages
    });
};

exports.bbsFollowPostPage = async (req, res) => {
    let doc = await BBSLogModel.findById(req.params.id).cursor().next();
    res.render("bbsfollow", {
        targetid: req.params.id,
        msg: doc,
    })
}

exports.bbsFollowPost = async (req, res) => {
    let log = new BBSLogModel({
        name: req.body.postPoster,
        title: req.body.postTitle,
        content: req.body.postContent,
        date: new Date(Date.now()),
        address: req.body.postMailaddress,
        threadid: req.body.targetId
    })
    await log.save();
    res.redirect("/bbs");
}

exports.bbsThreadShow = async (req, res) => {
    const arr = await BBSLogModel.find({ threadid: req.params.id }).sort({ date: "desc" });
    let messages = [];
    for(doc of arr){
        messages.push(doc);
        console.log("pushing")
    }
    res.render("bbsthread", {
        messages: messages
    })

}