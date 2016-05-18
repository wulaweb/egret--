/**
 * Created by Saco on 2014/7/30.
 */
var GameScene = (function (_super) {
    __extends(GameScene, _super);
    function GameScene() {
        _super.call(this);
        this.initScoreZone();
        this.initBlockZone();
    }
    var d = __define,c=GameScene,p=c.prototype;
    p.initBg = function () {
        this._interactor = new egret.Bitmap();
        this._interactor.texture = RES.getRes("imgs.block1");
        this._interactor.alpha = 0;
        this._interactor.touchEnabled = true;
        this._blockZone.addChild(this._interactor);
    };
    p.reposition = function () {
        var w = GameSettings.COLUMN * (GameConfig.BLOCK_WIDTH + GameConfig.BLOCK_MARGIN);
        var h = GameSettings.ROW * (GameConfig.BLOCK_WIDTH + GameConfig.BLOCK_MARGIN);
        this._interactor.width = w;
        this._interactor.height = h;
        if (this._blockZone.width > this.stage.stageWidth)
            this._blockZone.scaleX = this._blockZone.scaleY = (this.stage.stageWidth - 20) / w;
        else
            this._blockZone.scaleX = this._blockZone.scaleY = 1;
        this._blockZone.x = this.stage.stageWidth / 2 - w / 2 * this._blockZone.scaleX;
        this._returnBtn.x = this.stage.stageWidth - this._returnBtn.width;
    };
    p.initBlockZone = function () {
        this._blockZone = new egret.DisplayObjectContainer();
        this._blockZone.y = GameConfig.TOP_MARGIN;
        this._blockZone.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.checkGeture, this);
        this.addChild(this._blockZone);
    };
    p.checkGeture = function (e) {
        this._startIndex = this.getTouchIndexByPos(e.localX, e.localY);
        //两种模式分开处理
        if (GameSettings.TYPE == GameConfig.TYPE_3CLEAR) {
            this._touchStartX = e.localX;
            this._touchStartY = e.localY;
            this._blockZone.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
        }
        else {
            this.onBlockClick(this._startIndex);
        }
    };
    p.onTouchMove = function (e) {
        var towards;
        var isCanSwitch;
        if (this._touchStartX - e.localX > GameConfig.TOUCH_MOVE_LENGTH) {
            towards = "left";
        }
        else if (e.localX - this._touchStartX > GameConfig.TOUCH_MOVE_LENGTH) {
            towards = "right";
        }
        else if (e.localY - this._touchStartY > GameConfig.TOUCH_MOVE_LENGTH) {
            towards = "down";
        }
        else if (this._touchStartY - e.localY > GameConfig.TOUCH_MOVE_LENGTH) {
            towards = "up";
        }
        if (towards != undefined) {
            var towardIndex = RulesManager.i().getIndexByTowards(this._startIndex, towards);
            isCanSwitch = BlockManager.i().checkIfMoveCan3Clear(this._startIndex, towardIndex);
            BlockManager.i().switchIndex(this._startIndex, towardIndex, isCanSwitch);
            this._blockZone.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
        }
    };
    p.initScoreZone = function () {
        this._scoreZone = new egret.DisplayObjectContainer();
        this._scoreZone.x = 15;
        this._scoreZone.y = 15;
        this._gameScore = new GameScore();
        this._gameScore.resetScore();
        this._scoreZone.addChild(this._gameScore);
        this.addChild(this._scoreZone);
    };
    p.onBlockClick = function (index) {
        var blastBlock = RulesManager.i().getSameBlocksNearby(index);
        var score = RulesManager.i().getScoreByBlockCount(blastBlock.length);
        var scoreType = RulesManager.i().getScoreType(blastBlock.length);
        var pos = BlockManager.i().getPosByIndex(index);
        this.showScore(score, scoreType, pos.x, pos.y);
        AchieveManager.i().recordData(blastBlock.length, BlockManager.i().getBlockByIndex(blastBlock[0]).type);
        BlockManager.i().blastBlocks(blastBlock);
        this._gameScore.addScore(blastBlock.length * score);
        this._timeProgress.changeTimeSpeed(RulesManager.i().getTimeSpeedChange(blastBlock.length));
    };
    p.showScore = function (score, scoreType, x, y) {
        if (!this._showScore)
            this._showScore = BitmapNumber.i().createNumPic(score, scoreType);
        else
            BitmapNumber.i().changeNum(this._showScore, score, scoreType);
        this.jumpScore(x, y);
    };
    p.jumpScore = function (x, y) {
        var scoreObj = this._showScore;
        scoreObj.x = x;
        scoreObj.y = y;
        var targetY = scoreObj.y - 80;
        this.addChild(scoreObj);
        egret.Tween.removeTweens(scoreObj);
        egret.Tween.get(scoreObj).to({ y: targetY }, 600, egret.Ease.cubicOut).call(function () {
            scoreObj.parent.removeChild(scoreObj);
        });
    };
    p.getTouchIndexByPos = function (localX, localY) {
        return Math.floor(localX / (GameConfig.BLOCK_WIDTH + GameConfig.BLOCK_MARGIN)) +
            Math.floor(localY / (GameConfig.BLOCK_WIDTH + GameConfig.BLOCK_MARGIN)) * GameSettings.COLUMN;
    };
    p.initUI = function () {
        this.initBg();
        this.initProgress();
        this.initBtn();
    };
    p.initBtn = function () {
        this._returnBtn = new egret.Bitmap();
        this._returnBtn.y = 10;
        this._returnBtn.touchEnabled = true;
        this._returnBtn.texture = RES.getRes("imgs.return");
        this._returnBtn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.returnToMenu, this);
        this.addChild(this._returnBtn);
    };
    p.returnToMenu = function (e) {
        this._timeProgress.stop();
        this.stopGame();
        EventCenter.dispatchEvent(new GameEvent(GameEvent.GAME_EVENT_GAMERESTART));
    };
    p.initProgress = function () {
        this._timeProgress = new TimeProgress();
        this._timeProgress.getProgressBar().y = 70;
        this.addChild(this._timeProgress.getProgressBar());
    };
    p.startGame = function (difficulty) {
        this._timeProgress.startCounting();
        this._gameScore.resetScore();
        this.setGameProperty(difficulty);
        this.createGameZone(difficulty);
        this.reposition();
    };
    p.setGameProperty = function (difficulty) {
        GameSettings.TYPE = difficulty;
        GameSettings.COLUMN = GameConfig.TYPE_COLUMN[difficulty];
        GameSettings.ROW = GameConfig.TYPE_ROW[difficulty];
        GameSettings.CURR_COLORS = GameConfig.TYPE_COLOR_NUM[difficulty];
    };
    p.createGameZone = function (difficulty) {
        BlockManager.i().setContainer(this._blockZone);
        BlockManager.i().resetData();
        BlockManager.i().fillBlocks();
        if (GameSettings.TYPE == GameConfig.TYPE_3CLEAR)
            BlockManager.i().check3Clear();
    };
    p.gameOver = function () {
        this.showShareDialogue();
    };
    p.showShareDialogue = function () {
    };
    p.stopGame = function () {
    };
    return GameScene;
})(egret.Sprite);
egret.registerClass(GameScene,'GameScene');
//# sourceMappingURL=GameScene.js.map