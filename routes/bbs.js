let express = require("express");
let router = express.Router();

// コントローラーを要求
let bbsController = require("../controllers/bbsController");

// BBS 関連ルート //

// GET BBS //
router.get("/read", bbsController.bbs);
router.get("/", bbsController.bbs);
/*
// GET BBS with query //
// next page
router.get("/:mattaritime.:since-", bbsController.bbsIntegration);
// mattariload
router.get("/-:until", bbsController.bbsIntegration);
//次のページ・まったりロード統合
*/
router.get("/:mattaritime.:since-:until", bbsController.bbsIntegration);

// POST メッセージ //
router.post("/", bbsController.bbsMessagePost);

// GET フォロー投稿//
router.get("/follow/:id", bbsController.bbsFollowPostPage); //直接のフォロー先ID
// POST フォロー投稿//
router.post("/follow/:targetid", bbsController.bbsFollowPost); //根のフォロー先ID

// GET スレッド表示//
router.get("/thread/:id", bbsController.bbsThreadShow);


// GET BBS ヽ(´ー｀)ノロード //
//router.get("/mattari", bbsController.mattari);

module.exports = router;