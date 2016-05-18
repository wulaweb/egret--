//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends egret.DisplayObjectContainer {

    /**
     * 加载进度界面
     * Process interface loading
     */
    //private loadingView:LoadingUI;

    /**
    * 加载进度界面
    */
    private _loadingView: LoadingUI;
    /*主菜单*/
    private _mainMenu: MainMenu;
    /*游戏界面*/
    private _gameScene: GameScene;
    /*分享界面*/
    private _share: GameShare;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
    }

    private onAddToStage(event: egret.Event) {
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
    private onConfigComplete(event: RES.ResourceEvent): void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE,this.onConfigComplete,this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE,this.onResourceLoadComplete,this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS,this.onResourceProgress,this);
        RES.loadGroup("assets");
        RES.getResAsync("bg",this.onLoadedBg,this);
    }
    /**
     * preload资源组加载完成
     */
    private onResourceLoadComplete(event: RES.ResourceEvent): void {
        this.stage.removeChild(this._loadingView);
        this.initScenes();
        EventCenter.addEventListener(GameEvent.GAME_EVENT_GAMESTART,this.gameStart,this);
        EventCenter.addEventListener(GameEvent.GAME_EVENT_GAMEOVER,this.gameOver,this);
        EventCenter.addEventListener(GameEvent.GAME_EVENT_GAMERESTART,this.gameRestart,this);
        RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE,this.onResourceLoadComplete,this);
        RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS,this.onResourceProgress,this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE,this.onShareLoaded,this);
        RES.loadGroup("shareGroup");
    }

    private onShareLoaded(e: RES.ResourceEvent): void {
        RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE,this.onShareLoaded,this);
        this._share.setImg();
    }

    private initScenes(): void {
        
        this._mainMenu = new MainMenu();
        this._gameScene = new GameScene();
        this._share = new GameShare();
        this.addChild(this._mainMenu);
        this._gameScene.initUI();
        this._mainMenu.initUI();
        this._mainMenu.playAnimation();
    }


    private onLoadedBg(e: RES.ResourceEvent): void {
        var bg: egret.Bitmap = new egret.Bitmap();
        bg.texture = RES.getRes("bg");
        this.addChildAt(bg,0);
    }

    private clearView(): void {
        if(this._gameScene.parent)
            this.removeChild(this._gameScene);
        if(this._mainMenu.parent)
            this.removeChild(this._mainMenu);
        if(this._share.parent)
            this.removeChild(this._share);
    }

    //游戏结束
    private gameOver(e: GameEvent): void {
        this.clearView();
        this.addChild(this._share);
        this._share.showResult();
    }

    //游戏开始
    private gameStart(e: GameEvent): void {
        GameSettings.TYPE = e.eventBody;
        AchieveManager.i().start();
        this.clearView();
        this.addChild(this._gameScene);
        this._gameScene.startGame(GameSettings.TYPE);
    }

    private gameRestart(e: GameEvent): void {
        this.clearView();
        this.addChild(this._mainMenu);
    }

    /**
     * preload资源组加载进度
     */
    private onResourceProgress(event: RES.ResourceEvent): void {
        this._loadingView.setProgress(event.itemsLoaded,event.itemsTotal);
    }
}


