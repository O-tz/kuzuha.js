let express = require("express");
let router = express.Router();

// コントローラーのメソッドを利用可能にする
let bbsController = require("../controllers/bbsController");

// BBS 関連ルート //

router.get("/read", bbsController.bbs);
router.get("/", bbsController.bbs);
router.post("/", bbsController.bbsMessagePost);
router.get("/follow/:id", bbsController.bbsFollowPostPage); //直接のフォロー先ID
router.post("/follow/:targetid", bbsController.bbsFollowPost); //根のフォロー先ID
// GET スレッド表示//
router.get("/thread/:id", bbsController.bbsThreadShow);


// GET BBS ヽ(´ー｀)ノロード //
//router.get("/mattari", bbsController.mattari);

module.exports = router;