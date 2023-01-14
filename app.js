// モジュールの読み込み //
//Express モジュールの読み込み
let express = require('express');
//mongooseモジュールの読み込み
let mongoose = require('mongoose');
// favicon
//let favicon = require("serve-favicon");
//logger モジュールの読み込み
let logger = require("morgan");
// path モジュールの読み込み
let path = require("path");
// cookie-parser の読み込み
let cookieParser = require("cookie-parser");

// ルーターの読み込み //
let indexRouter = require("./routes/index");
let bbsRouter = require("./routes/bbs");
//let bbsLogRouter = require("./routes/bbslog");

// あんまよくわかってない //
let compression = require("compression");
let helmet = require("helmet");

// Express //
let app = express();


// mongoose 接続設定 //
let mongoDB = `mongodb+srv://${process.env.username}:${process.env.password}@kuzuhajs.${process.env.monogoDBid}.mongodb.net/kuzuhajs?retryWrites=true&w=majority`
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

/*
app.get('/', function(req, res){
    res.send('Hello World!');
});

app.listen(3000, function(){
    console.log('Example app listening on port 3000!');
});
*/