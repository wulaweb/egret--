/**
 * Created by Saco on 2014/8/12.
 */
class GameScore extends egret.DisplayObjectContainer
{
    public static score:number;
    private _titleBm:egret.Bitmap;
    private _scorePic:egret.DisplayObjectContainer;
    public constructor()
    {
        super();
        this.init();
    }

    private init():void
    {
        this._titleBm = new egret.Bitmap();
        this._titleBm.texture = RES.getRes("imgs.total_score");
        this.addChild(this._titleBm);

        this._scorePic = BitmapNumber.i().createNumPic(0, "y");
        this._scorePic.x = 80;
        this.addChild(this._scorePic);
    }

    public resetScore():void
    {
        GameScore.score = 0;
        BitmapNumber.i().changeNum(this._scorePic, 0, "y");
    }

    public addScore(count:number):void
    {
        GameScore.score += count;
        BitmapNumber.i().changeNum(this._scorePic, GameScore.score, "y");
    }
}
