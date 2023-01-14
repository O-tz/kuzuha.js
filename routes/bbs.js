let express = require("express");
let router = express.Router();

// コントローラーを要求
let bbsController = require("../controllers/bbsController");
let bbsLogController = require("../controllers/bbsLogController");
//let uploaderController = require("../controllers/uploaderController");

// BBS 関連ルート //

// GET BBS //
router.get("/", bbsController.bbs);

// GET BBS with query //
// next page
router.get("/:mattaritime.:since-", bbsController.bbsNextPage);
// mattariload
router.get("/-:until", bbsController.bbsMattariload);

// POST メッセージ //
router.post("/", bbsController.bbsMessagePost);

// GET BBS ヽ(´ー｀)ノロード //
//router.get("/mattari", bbsController.mattari);

module.exports = router;