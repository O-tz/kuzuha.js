/**
 * Module dependencies.
 */
const createError = require("http-errors");
const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const helmet = require("helmet");


// favicon
//let favicon = require("serve-favicon");

// ルーターの設定 //
const indexRouter = require("./routes/index");
const bbsRouter = require("./routes/bbs");
//const bbsLogRouter = require("./routes/bbslog");


// Express //
const app = express();


// mongoose 接続設定 //
let mongoDB = `mongodb+srv://${process.env.username}:${process.env.password}@kuzuhajs.${process.env.mongoDBid}.mongodb.net/kuzuhajs?retryWrites=true&w=majority`
mongoose.connect(mongoDB);
//mongooseがglobal promise libraryを使うようにする
mongoose.Promise = global.Promise;
//デフォルトの接続
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view エンジン設定 //
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'pug');

// その他設定 //
app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());
app.use(compression()); // ？すべてのルートを圧縮

app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/bbs", bbsRouter);
//app.use("/up", uploaderRouter);
//app.use("/bbslog", bbsLogRouter);

// 404 を捕捉してエラーハンドラにとばす//
app.use(function(req, res, next) {
    next(createError(404));
});

// エラーハンドラ
app.use(function(err, req, res, next) {
    // ローカルに設定。開発中のみ表示
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // エラーページのレンダリング
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
