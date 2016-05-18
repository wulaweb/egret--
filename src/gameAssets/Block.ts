/**
 * Created by Saco on 2014/7/30.
 */
class Block extends egret.Sprite
{
    public type:number;
    private _img:egret.Bitmap;
    private _targetX:number;
    private _targetY:number;
    public constructor()
    {
        super();
        this.width = GameConfig.BLOCK_WIDTH;
        this.height = GameConfig.BLOCK_WIDTH;
        this.initImg();
        this.getRandomColor();
        this.touchEnabled = false;
        this.touchChildren = false;
    }

    private getRandomColor(type?:number):void
    {
        this.type = (type != null) ? type : Math.floor(Math.random()*GameSettings.CURR_COLORS);
        this._img.texture = RES.getRes("imgs.block" + this.type);
        this._img.fillMode = egret.BitmapFillMode.SCALE;
    }

    private initImg():void
    {
        this._img = new egret.Bitmap();
        this.addChild(this._img);
    }

    public resetColor(type?:number):void
    {
        if(type != null)
            this.getRandomColor(type);
        else
            this.getRandomColor();
    }

    public blast():void
    {
        egret.Tween.removeTweens(this);
        this._targetX = this.x - 8;
        this._targetY = this.y - 8;
        egret.Tween.get(this).to({scaleX:1.2, scaleY:1.2, alpha:0, x:this._targetX, y:this._targetY}, 300).call(function (){
            this.parent.removeChild(this);
            EventCenter.dispatchEvent(new GameEvent(GameEvent.COLLECT_BLOCK, this));
        }, this);
    }

    public playFadeInAnimation():void
    {
        egret.Tween.removeTweens(this);
        this._targetX = this.x;
        this._targetY = this.y;
        this.alpha = 0;
        this.scaleX = 0;
        this.scaleY = 0;
        this.x = this.x + GameConfig.BLOCK_WIDTH/2;
        this.y = this.y + GameConfig.BLOCK_WIDTH/2;
        egret.Tween.get(this).to({scaleX:1, scaleY:1, alpha:1, x:this._targetX, y:this._targetY}, 300);
    }

    public reset():void
    {
        this.resetColor();
        this.resetProperty();
    }

    public resetProperty():void
    {
        this.scaleX = 1;
        this.scaleY = 1;
        this.alpha = 1;
    }
}