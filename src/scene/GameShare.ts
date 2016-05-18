/**
 * Created by Saco on 2014/8/26.
 */
class GameShare extends egret.Sprite
{
    private _shareWnd:HotspotBitmap;
    private _score:egret.DisplayObjectContainer;
    private _achieveTF:egret.TextField;
    private _guideArrow:ShareArrow;
    private _achieve:any;

    public constructor()
    {
        super();
        this.init();
    }

    public setImg():void
    {
        if(this._shareWnd)
            this._shareWnd.texture = RES.getRes("share");
        if(this._guideArrow)
            this._guideArrow.setImg();
    }

    private init():void
    {
        this.initBm();
        this.initScore();
        this.initTF();
        this.initArrow();
        //this.setDefaultShareData();
    }

    private initBm():void
    {
        this._shareWnd = new HotspotBitmap();
        this._shareWnd.x = 22;
        this._shareWnd.y = 100;
        this.addChild(this._shareWnd);

        var rectReturn:egret.Rectangle = new egret.Rectangle(0, 390, 210, 75);
        var rectShare:egret.Rectangle = new egret.Rectangle(220, 390, 210, 75);
        this._shareWnd.addHotspotArea(rectReturn, this.returnToMenu, this);
        //this._shareWnd.addHotspotArea(rectShare, this.share, this);
    }

    private initScore():void
    {
        this._score = BitmapNumber.i().createNumPic(0, "y");
        this._score.y = 250;
        this.addChild(this._score);
    }

    private initTF():void
    {
        this._achieveTF = new egret.TextField();
        this._achieveTF.x = 60;
        this._achieveTF.y = 320;
        this._achieveTF.width = 360;
        this._achieveTF.height = 180;
        this._achieveTF.textAlign = egret.HorizontalAlign.CENTER;
        this._achieveTF.size = 30;
        this._achieveTF.bold = true;
        this._achieveTF.lineSpacing = 10;
        this._achieveTF.fontFamily = "Microsoft YaHei";
        this._achieveTF.textColor = 0x545454;
        this.addChild(this._achieveTF);
    }

    private initArrow():void
    {
        this._guideArrow = new ShareArrow();
    }

    private returnToMenu():void
    {
        EventCenter.dispatchEvent(new GameEvent(GameEvent.GAME_EVENT_GAMERESTART));
    }

//    private share():void
//    {
//        var thisObj = this;
//        this.addChild(this._guideArrow);
//        this._guideArrow.startGuide();
//        WeixinApi.ready(function(api:WeixinApi){
//            var info:WeixinShareInfo = new WeixinShareInfo();
//            info.title = "《消灭方块》我打了" + GameScore.score + "分，完全停不下来了!";
//            info.desc = thisObj._achieve.others;
//            info.link = "sgame.sinaapp.com";
//            info.imgUrl = "http://sgame.sinaapp.com/resource/assets/icon.jpg";
//            api.shareToFriend(info);
//            api.shareToTimeline(info);
//        });
//    }

//    private setDefaultShareData():void
//    {
//        WeixinApi.ready(function(api:WeixinApi){
//            var info:WeixinShareInfo = new WeixinShareInfo();
//            info.title = "《消灭方块》轻松益智休闲小游戏";
//            info.desc = "完全停不下来了，快来跟我一试高下";
//            info.link = "sgame.sinaapp.com";
//            info.imgUrl = "http://sgame.sinaapp.com/resource/assets/icon.jpg";
//            api.shareToFriend(info);
//            api.shareToTimeline(info);
//        });
//    }

    public showResult():void
    {
        BitmapNumber.i().changeNum(this._score, GameScore.score, "y");
        this._score.x = (this.stage.stageWidth - this._score.width)/2;
        this._achieve = AchieveManager.i().getTitle();
        this._achieveTF.text = this._achieve.self;
        this.playAmination();
    }

    private playAmination():void
    {
        this._shareWnd.x = this._shareWnd.width/4 - 11;
        this._shareWnd.y = this._shareWnd.height/4 - 50;
        this._shareWnd.scaleX = 0.5;
        this._shareWnd.scaleY = 0.5;
        egret.Tween.get(this._shareWnd).to({x:22, y:100, scaleX:1, scaleY:1}, 800, egret.Ease.backOut);
    }
}
