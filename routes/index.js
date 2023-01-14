let express = require("express");
let router = express.Router();

// コントローラーを要求
let bbsController = require("../controllers/bbsController");
let bbsLogController = require("../controllers/bbsLogController");
//let uploaderController = require("../controllers/uploaderController");

// GET 広報室//
router.get("/", bbsController.index);

module.exports = router;