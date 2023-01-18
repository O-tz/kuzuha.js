let BBSModel = require("../models/bbs.model");
let BBSLogModel = require("../models/bbslog.model");
let bbsInstance = new BBSModel();

const {body, validationResult} = require("express-validator");

const foundedDate = bbsInstance.foundedDate;
const mailto = bbsInstance.mailAddress;
let msgDisp = bbsInstance.msgDisp;


let async = require("async");
const { contentSecurityPolicy } = require("helmet");

exports.index = function(req, res){
    res.render("index");
};

exports.bbs = async (req, res) => {
    if (!req.query.mattari) {
        if(!req.query.since){
            let cursor = BBSLogModel.find({}).limit(msgDisp).sort({date: "desc"}).cursor();
            let messages = [];
            for (let doc = await cursor.next(); doc != null; doc = await cursor.next()){
                messages.push(doc);
            }
            res.render("bbs", {
                mailto: "mailto:" + mailto,
                foundeddate: foundedDate,
                messages: messages,
                since: "",
                until: "",
                mattaritime: ""
            });
        }else{
            //ヽ(´ー｀)ノロード
            const since = new Date(parseInt(req.query.since));
            const until = new Date(Date.now());
            let cursor = BBSLogModel.find({date: {$gt: since, $lte: until}}).limit(msgDisp).sort({date: "desc"}).cursor();
            let messages = [];
            for (let doc = await cursor.next(); doc != null; doc = await cursor.next()){
                messages.push(doc);
            }
            res.render("bbs", {
                mailto: "mailto:" + mailto,
                foundeddate: foundedDate,
                messages: messages,
                mattaritime: until.getTime()
            });
        }
    }else {
        //次のページ
        console.log(req.query)//test
        const until = new Date(parseInt(req.query.until));
        const since = req.query.since ? req.query.since : "";
        let cursor;
        if (since){
            cursor = BBSLogModel.find({date: {$gte: new Date(parse(since)), $lt: until}}).limit(msgDisp).sort({date: "desc"}).cursor();
        }else{
            cursor = BBSLogModel.find({date: {$lt: until}}).limit(msgDisp).sort({date: "desc"}).cursor();
        }
        let messages = [];
        for (let doc = await cursor.next(); doc != null; doc = await cursor.next()){
            messages.push(doc);
        }
        res.render("bbs", {
            mailto: "mailto:" + mailto,
            foundeddate: foundedDate,
            messages: messages,
            mattaritime: req.query.mattari,
            until: until.getTime(),
            since: since
        });
    }
    
};

exports.bbsMessagePost = (req, res) => {
    req.body.numberOfPostsDisplayed;
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
        threadid: req.body.targetId,
        parentId: req.body.parentId
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

/*
exports.bbsIntegration = async (req, res) => {
    const mattaritime = req.params.mattaritime ? req.params.mattaritime : "";
    const since = req.params.since ? new Date(parseInt(req.params.since)) : new Date(0);
    const until = req.params.until ? new Date(parseInt(req.params.until)) : new Date(Date.now());
    let cursor = BBSLogModel.find({"date": {$gt: since, $lt: until}}).limit(msgDisp).sort({date: "desc"}).cursor();
    let messages = [];
    for (let doc = await cursor.next(); doc != null; await cursor.next()) {
        messages.push(doc);
    }
    res.render("bbs", {
        mattaritime: mattaritime,
        messages: messages,
        since: since.getTime(),
        until: until.getTime(),
    })
}

exports.bbsNextPage = async (req, res) => {
    console.log(req.params.since);
    let time = new Date(Number(req.params.since));
    let mattaritime = req.params.mattaritime;
    console.log(mattaritime);
    let cursor = BBSLogModel.find({}).lt("date", time).limit(msgDisp).sort({date: "desc"}).cursor();
    let messages = [];
    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()){
        messages.push(doc);
    }
    console.log(messages);
    res.render("bbs", {
        mailto: "mailto:" + mailto,
        foundeddate: foundedDate,
        messages: messages,
        mattaritime: mattaritime
    });
};

exports.bbsMattariload = async (req, res) => {
    let time = new Date(Number(req.params["until"]));
    let cursor = BBSLogModel.find({}).gt("date", time).limit(msgDisp).sort({date: "desc"}).cursor();
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

*/