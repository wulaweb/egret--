/**
 * Created by Saco on 2014/7/30.
 */
var MainMenu = (function (_super) {
    __extends(MainMenu, _super);
    function MainMenu() {
        _super.call(this);
        //EventCenter.dispatchEvent(new GameEvent(GameEvent.GAME_EVENT_GAMESTART,GameConfig.TYPE_3CLEAR));
    }
    var d = __define,c=MainMenu,p=c.prototype;
    p.initUI = function () {
        //this.initLogo();
        this.initBtns();
        //this.initAuthor();
        //this.initBgBlock();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.playAnimation, this);
    };
    p.initBgBlock = function () {
        this._aniBlocks = [];
        this._aniBlocks.push(BlockManager.i().getNewBlock(3));
        this._aniBlocks.push(BlockManager.i().getNewBlock(6));
        this._aniBlocks.push(BlockManager.i().getNewBlock(1));
        this._aniBlocks.push(BlockManager.i().getNewBlock(2));
        this.addChildAt(this._aniBlocks[3], 0);
        this.addChildAt(this._aniBlocks[1], 0);
        this.addChildAt(this._aniBlocks[2], 0);
        this.addChildAt(this._aniBlocks[0], 0);
    };
    p.initLogo = function () {
        this._logo = new egret.Bitmap();
        this._logo.texture = RES.getRes("imgs.logo");
        this._logo.y = 100;
        this._logo.x = this.stage.stageWidth / 2 - this._logo.width / 2;
        //this.addChild(this._logo);
    };
    p.initBtns = function () {
        this._btnSimple = this.configureImg("easy");
        //this._btnHard = this.configureImg("hard");
        this._btnSimple.y = 250;
        //this._btnHard.y = 320;
        this.addChild(this._btnSimple);
        //this.addChild(this._btnHard);
    };
    p.initAuthor = function () {
        this._tfTips = new egret.TextField();
        //        this._author.text = "Saco:286844968(QQ)";
        this._tfTips.width = 320;
        this._tfTips.size = 16;
        this._tfTips.textAlign = egret.HorizontalAlign.CENTER;
        this._tfTips.textColor = 0x5c5c5c;
        this._tfTips.y = 450;
        this._tfTips.x = this.stage.stageWidth / 2 - this._tfTips.width / 2;
        //        this.addChild(this._author);
    };
    p.configureImg = function (name) {
        var bitmap = new egret.Bitmap();
        bitmap.texture = RES.getRes("imgs." + name);
        bitmap.touchEnabled = true;
        bitmap.x = this.stage.stageWidth / 2 - bitmap.width / 2;
        bitmap.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouch, this);
        return bitmap;
    };
    p.onTouch = function (e) {
        var diff;
        switch (e.currentTarget) {
            case this._btnSimple:
                {
                    diff = GameConfig.TYPE_3CLEAR;
                    break;
                }
            case this._btnHard:
                {
                    diff = GameConfig.TYPE_DES;
                    break;
                }
        }
        EventCenter.dispatchEvent(new GameEvent(GameEvent.GAME_EVENT_GAMESTART, diff));
    };
    p.playAnimation = function (e) {
        //        this._aniBlocks[0].x = - GameConfig.BLOCK_WIDTH;
        //        this._aniBlocks[1].y = - GameConfig.BLOCK_WIDTH;
        //        this._aniBlocks[2].y = this.stage.stageHeight + GameConfig.BLOCK_WIDTH;
        //        this._aniBlocks[3].x = this.stage.stageWidth + GameConfig.BLOCK_WIDTH;
        //        egret.Tween.get(this._aniBlocks[0]).to({x:90,y:90}, 500, egret.Ease.backOut);
        //        egret.Tween.get(this._aniBlocks[1]).to({x:160,y:80,scaleX:1.2,scaleY:1.2}, 500, egret.Ease.backOut);
        //        egret.Tween.get(this._aniBlocks[2]).to({x:240,y:85,scaleX:1.2,scaleY:1.2}, 500, egret.Ease.backOut);
        //        egret.Tween.get(this._aniBlocks[3]).to({x:310,y:90}, 500, egret.Ease.backOut);
        //        setTimeout(this.shakeBgBlock, 2000, this);
        EventCenter.dispatchEvent(new GameEvent(GameEvent.GAME_EVENT_GAMESTART, GameConfig.TYPE_3CLEAR));
    };
    p.shakeBgBlock = function (thisObj) {
        var target = thisObj._aniBlocks[egret.getTimer() % 4];
        var scale = target.scaleX;
        egret.Tween.get(target).to({ scaleX: scale * 1.2, scaleY: scale * 1.2 }, 500, egret.Ease.backIn).to({ scaleX: scale, scaleY: scale }, 500, egret.Ease.backOut);
        if (thisObj.stage)
            setTimeout(thisObj.shakeBgBlock, (3000 + Math.random() * 1000), thisObj);
    };
    return MainMenu;
})(egret.Sprite);
egret.registerClass(MainMenu,'MainMenu');
//# sourceMappingURL=MainMenu.js.map