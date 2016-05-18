/**
 * Created by Saco on 2014/8/17.
 */
class ProgressBar extends egret.DisplayObjectContainer
{
    private _barBg:egret.Shape;
    private _bar:egret.Shape;
    private _barMask:egret.Rectangle;
    private _progress:number = 100;
    private _barMaxWidth:number;

    public constructor(width:number)
    {
        super();
        this._barMaxWidth = width;
        this.initSkin();
    }

    private initSkin():void
    {
        this._bar = new egret.Shape();
        this._bar.graphics.beginFill(0xe0556d);
        this._bar.graphics.drawRect(2, 2, 476, 6);
        this._bar.graphics.endFill();

        this._barMask = new egret.Rectangle(0, 0, 476, 10);

        this._barBg = new egret.Shape();
        this._barBg.graphics.beginFill(0xffffff);
        this._barBg.graphics.drawRect(0, 0, 480, 10);
        this._barBg.graphics.endFill();

        this.addChild(this._barBg);
        this.addChild(this._bar);
        this._bar.mask = this._barMask;
    }

    /*如果有para2的话，进度为para1/para2*100%，否则按para1为百分数para1%*/
    public setProgress(para1:number, para2?:number):void
    {
        var pro:number;
        if(para2)
            pro = Math.round(para1/para2*100)
        else
            pro = para1;

        if(pro > 100)
            pro = 100;
        if(pro < 0)
            pro = 0;
        this._progress = pro;
        this.updateProgress();
    }

    private updateProgress():void
    {
        egret.Tween.removeTweens(this._bar);
        egret.Tween.get(this._barMask).to({width:476 * this._progress / 100}, 1000);
    }

    public reset():void
    {
        this._progress = 100;
    }

    public getProgress():number
    {
        return this._progress;
    }
}