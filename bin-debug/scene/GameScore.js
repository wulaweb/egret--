/**
 * Created by Saco on 2014/8/12.
 */
var GameScore = (function (_super) {
    __extends(GameScore, _super);
    function GameScore() {
        _super.call(this);
        this.init();
    }
    var d = __define,c=GameScore,p=c.prototype;
    p.init = function () {
        this._titleBm = new egret.Bitmap();
        this._titleBm.texture = RES.getRes("imgs.total_score");
        this.addChild(this._titleBm);
        this._scorePic = BitmapNumber.i().createNumPic(0, "y");
        this._scorePic.x = 80;
        this.addChild(this._scorePic);
    };
    p.resetScore = function () {
        GameScore.score = 0;
        BitmapNumber.i().changeNum(this._scorePic, 0, "y");
    };
    p.addScore = function (count) {
        GameScore.score += count;
        BitmapNumber.i().changeNum(this._scorePic, GameScore.score, "y");
    };
    return GameScore;
})(egret.DisplayObjectContainer);
egret.registerClass(GameScore,'GameScore');
//# sourceMappingURL=GameScore.js.map