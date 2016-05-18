''/*
Author Saco
2014.7.30
*/

class GameApp extends egret.DisplayObjectContainer
{

    /**
     * 加载进度界面
     */
    private _loadingView:LoadingUI;
    /*主菜单*/
    private _mainMenu:MainMenu;
    /*游戏界面*/
    private _gameScene:GameScene;
    /*分享界面*/
    private _share:GameShare;

    public constructor()
    {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
    }

    private onAddToStage(event:egret.Event)
    {
        //设置加载进度界面
        this._loadingView = new LoadingUI();
        this.stage.addChild(this._loadingView);
        if(egret.MainContext.deviceType == egret.MainContext.DEVICE_MOBILE)
            this.stage.scaleMode = egret.StageScaleMode.NO_BORDER;

        //egret.Profiler.getInstance().run();
        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE,this.onConfigComplete,this);
        RES.loadConfig("resource/resource.json","resource/");
    }
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     */
    private onConfigComplete(event:RES.ResourceEvent):void
    {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE,this.onConfigComplete,this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE,this.onResourceLoadComplete,this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS,this.onResourceProgress,this);
        RES.loadGroup("assets");
        RES.getResAsync("bg", this.onLoadedBg, this);
    }
    /**
     * preload资源组加载完成
     */
    private onResourceLoadComplete(event:RES.ResourceEvent):void
    {
        this.stage.removeChild(this._loadingView);
        this.initScenes();
        EventCenter.addEventListener(GameEvent.GAME_EVENT_GAMESTART, this.gameStart, this);
        EventCenter.addEventListener(GameEvent.GAME_EVENT_GAMEOVER, this.gameOver, this);
        EventCenter.addEventListener(GameEvent.GAME_EVENT_GAMERESTART, this.gameRestart, this);
        RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE,this.onResourceLoadComplete,this);
        RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS,this.onResourceProgress,this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE,this.onShareLoaded,this);
        RES.loadGroup("shareGroup");
    }

    private onShareLoaded(e:RES.ResourceEvent):void
    {
        RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE,this.onShareLoaded,this);
        this._share.setImg();
    }

    private initScenes():void
    {
        this.initAd();
        this._mainMenu = new MainMenu();
        this._gameScene = new GameScene();
        this._share = new GameShare();
        this.addChild(this._mainMenu);
        this._gameScene.initUI();
        this._mainMenu.initUI();
        this._mainMenu.playAnimation();
    }

    private initAd():void
    {
//        var url:string = "http://googleads.g.doubleclick.net/pagead/ads?ad_type=video&client=ca-games-pub-4968145218643279&videoad_start_delay=0&description_url=http%3A%2F%2Fwww.google.com&max_ad_duration=40000&adtest=on";
//        new AdSense().show(url, 480, 70, 0, window.innerHeight - 70);
    }

    private onLoadedBg(e:RES.ResourceEvent):void
    {
        var bg:egret.Bitmap = new egret.Bitmap();
        bg.texture = RES.getRes("bg");
        this.addChildAt(bg, 0);
    }

    private clearView():void
    {
        if(this._gameScene.parent)
            this.removeChild(this._gameScene);
        if(this._mainMenu.parent)
            this.removeChild(this._mainMenu);
        if(this._share.parent)
            this.removeChild(this._share);
    }

    //游戏结束
    private gameOver(e:GameEvent):void
    {
        this.clearView();
        this.addChild(this._share);
        this._share.showResult();
    }

    //游戏开始
    private gameStart(e:GameEvent):void
    {
        GameSettings.TYPE = e.eventBody;
        AchieveManager.i().start();
        this.clearView();
        this.addChild(this._gameScene);
        this._gameScene.startGame(GameSettings.TYPE);
    }

    private gameRestart(e:GameEvent):void
    {
        this.clearView();
        this.addChild(this._mainMenu);
    }

    /**
     * preload资源组加载进度
     */
    private onResourceProgress(event:RES.ResourceEvent):void
    {
        this._loadingView.setProgress(event.itemsLoaded,event.itemsTotal);
    }
}