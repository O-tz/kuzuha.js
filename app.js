const createError = require("http-errors");
const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const helmet = require("helmet");
const favicon = require("serve-favicon");


const app = express();


//faviconの設定
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

//データベースの設定（mongoose, MongoDB の設定）
if (!process.env.username || !process.env.password || !process.env.mongoDBid) {
    let dotenvParsed = require('dotenv').config().parsed;
    var username = dotenvParsed.username;
    var password = dotenvParsed.password;
    var mongoDBid = dotenvParsed.mongoDBid;
}
let mongoDB = `mongodb+srv://${username ? username : process.env.username}:${password ? password : process.env.password}@kuzuhajs.${mongoDBid ? mongoDBid : process.env.mongoDBid}.mongodb.net/kuzuhajs?retryWrites=true&w=majority`
mongoose.connect(mongoDB);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//ページのレンダリングエンジンとレンダリングするファイルの場所の設定
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'pug');

// ルーターの設定
const indexRouter = require("./routes/index");
const bbsRouter = require("./routes/bbs");
const { Console } = require("console");
//const bbsLogRouter = require("./routes/bbslog");
app.use("/", indexRouter);
app.use("/bbs", bbsRouter);
//app.use("/up", uploaderRouter);
//app.use("/bbslog", bbsLogRouter);

//静的ファイルの場所の設定
app.use(express.static(path.join(__dirname, "public")));

//404
app.use(function(req, res, next) {
    next(createError(404));
});

//サーバー側のエラー処理
app.use(function(err, req, res, next) {
    // ローカルに設定。開発中のみ表示
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    //
    res.status(err.status || 500);
    res.render('error');
});

// その他設定 //
app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());
app.use(compression()); // ？すべてのルートを圧縮

module.exports = app;