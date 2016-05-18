/**
 * Created by Saco on 2014/9/1.
 */
class ShareArrow extends egret.Sprite
{
    private _arrow:egret.Bitmap;
    private _mask:egret.Shape;
    public constructor()
    {
        super();
        this.initMask();
        this.initBm();
    }

    private initBm():void
    {
        this._arrow = new egret.Bitmap();
        this.addChild(this._arrow);
    }

    public setImg():void
    {
        this._arrow.texture = RES.getRes("arrow");
    }

    private initMask():void
    {
        this._mask = new egret.Shape();
        this._mask.graphics.beginFill(0x000000, 0.5);
        this._mask.graphics.drawRect(0, 0, 480, 800);
        this._mask.graphics.endFill();
        this._mask.touchEnabled = true;
        this._mask.width = 480;
        this._mask.height = 800;
        this._mask.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.endGuide, this);
        this.addChild(this._mask);
    }

    public startGuide():void
    {
        this._arrow.x = this.stage.stageWidth - this._arrow.width;
        this.startAnimation();
    }

    public endGuide(e?:egret.TouchEvent):void
    {
        egret.Tween.removeTweens(this._arrow);
        this._arrow.y = 0;
        if(this.parent)
            this.parent.removeChild(this);
    }

    private startAnimation():void
    {
        egret.Tween.get(this._arrow,{loop:true}).to({y:30}, 600).to({y:0}, 600);
    }
}
