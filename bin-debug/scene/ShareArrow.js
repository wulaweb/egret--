/**
 * Created by Saco on 2014/9/1.
 */
var ShareArrow = (function (_super) {
    __extends(ShareArrow, _super);
    function ShareArrow() {
        _super.call(this);
        this.initMask();
        this.initBm();
    }
    var d = __define,c=ShareArrow,p=c.prototype;
    p.initBm = function () {
        this._arrow = new egret.Bitmap();
        this.addChild(this._arrow);
    };
    p.setImg = function () {
        this._arrow.texture = RES.getRes("arrow");
    };
    p.initMask = function () {
        this._mask = new egret.Shape();
        this._mask.graphics.beginFill(0x000000, 0.5);
        this._mask.graphics.drawRect(0, 0, 480, 800);
        this._mask.graphics.endFill();
        this._mask.touchEnabled = true;
        this._mask.width = 480;
        this._mask.height = 800;
        this._mask.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.endGuide, this);
        this.addChild(this._mask);
    };
    p.startGuide = function () {
        this._arrow.x = this.stage.stageWidth - this._arrow.width;
        this.startAnimation();
    };
    p.endGuide = function (e) {
        egret.Tween.removeTweens(this._arrow);
        this._arrow.y = 0;
        if (this.parent)
            this.parent.removeChild(this);
    };
    p.startAnimation = function () {
        egret.Tween.get(this._arrow, { loop: true }).to({ y: 30 }, 600).to({ y: 0 }, 600);
    };
    return ShareArrow;
})(egret.Sprite);
egret.registerClass(ShareArrow,'ShareArrow');
//# sourceMappingURL=ShareArrow.js.map