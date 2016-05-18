/**
 * Created by Saco on 2014/7/30.
 */

class GameScene extends egret.Sprite
{
    private _blockZone:egret.DisplayObjectContainer;
    private _scoreZone:egret.DisplayObjectContainer;
    private _gameScore:GameScore;
    private _interactor:egret.Bitmap;//接受鼠标事件
    private _returnBtn:egret.Bitmap;
    private _timeProgress:TimeProgress;
    private _showScore:egret.DisplayObjectContainer;
    private _startIndex:number;
    private _touchStartX:number;
    private _touchStartY:number;

    public constructor()
    {
        super();
        this.initScoreZone();
        this.initBlockZone();
    }

    private initBg():void
    {
        this._interactor = new egret.Bitmap();
        this._interactor.texture = RES.getRes("imgs.block1");
        this._interactor.alpha = 0;
        this._interactor.touchEnabled = true;
        this._blockZone.addChild(this._interactor);
    }

    private reposition():void
    {
        var w:number = GameSettings.COLUMN*(GameConfig.BLOCK_WIDTH+GameConfig.BLOCK_MARGIN);
        var h:number = GameSettings.ROW*(GameConfig.BLOCK_WIDTH+GameConfig.BLOCK_MARGIN);
        this._interactor.width = w;
        this._interactor.height = h;

        if(this._blockZone.width > this.stage.stageWidth)
            this._blockZone.scaleX = this._blockZone.scaleY = (this.stage.stageWidth - 20)/w;
        else
            this._blockZone.scaleX = this._blockZone.scaleY = 1;

        this._blockZone.x = this.stage.stageWidth/2 - w/2*this._blockZone.scaleX;
        this._returnBtn.x = this.stage.stageWidth - this._returnBtn.width;
    }

    private initBlockZone():void
    {
        this._blockZone = new egret.DisplayObjectContainer();
        this._blockZone.y = GameConfig.TOP_MARGIN;
        this._blockZone.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.checkGeture, this);
        this.addChild(this._blockZone);
    }

    private checkGeture(e:egret.TouchEvent):void
    {
        this._startIndex = this.getTouchIndexByPos(e.localX, e.localY);
        //两种模式分开处理
        if(GameSettings.TYPE == GameConfig.TYPE_3CLEAR)
        {
            this._touchStartX = e.localX;
            this._touchStartY = e.localY;
            this._blockZone.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
        }else
        {
            this.onBlockClick(this._startIndex);
        }
    }

    private onTouchMove(e:egret.TouchEvent):void
    {
        var towards:string;
        var isCanSwitch:boolean;
        if(this._touchStartX - e.localX > GameConfig.TOUCH_MOVE_LENGTH)
        {//left
            towards = "left";
        }else if(e.localX - this._touchStartX > GameConfig.TOUCH_MOVE_LENGTH)
        {//right
            towards = "right";
        }else if(e.localY - this._touchStartY > GameConfig.TOUCH_MOVE_LENGTH)
        {//down
            towards = "down";
        }else if(this._touchStartY - e.localY > GameConfig.TOUCH_MOVE_LENGTH)
        {//up
            towards = "up";
        }
        if(towards != undefined)
        {
            var towardIndex:number = RulesManager.i().getIndexByTowards(this._startIndex, towards);
            isCanSwitch = BlockManager.i().checkIfMoveCan3Clear(this._startIndex, towardIndex);
            BlockManager.i().switchIndex(this._startIndex, towardIndex, isCanSwitch);
            this._blockZone.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
        }
    }

    private initScoreZone():void
    {
        this._scoreZone = new egret.DisplayObjectContainer();
        this._scoreZone.x = 15;
        this._scoreZone.y = 15;
        this._gameScore = new GameScore();
        this._gameScore.resetScore();
        this._scoreZone.addChild(this._gameScore);
        this.addChild(this._scoreZone);
    }

    private onBlockClick(index:number):void
    {
        var blastBlock:number[] = RulesManager.i().getSameBlocksNearby(index);
        var score:number = RulesManager.i().getScoreByBlockCount(blastBlock.length);
        var scoreType:string = RulesManager.i().getScoreType(blastBlock.length);
        var pos:egret.Point = BlockManager.i().getPosByIndex(index);
        this.showScore(score, scoreType, pos.x, pos.y);
        AchieveManager.i().recordData(blastBlock.length, BlockManager.i().getBlockByIndex(blastBlock[0]).type);
        BlockManager.i().blastBlocks(blastBlock);
        this._gameScore.addScore(blastBlock.length*score);
        this._timeProgress.changeTimeSpeed(RulesManager.i().getTimeSpeedChange(blastBlock.length));
    }

    private showScore(score:number, scoreType:string, x:number, y:number):void
    {
        if(!this._showScore)
            this._showScore = BitmapNumber.i().createNumPic(score, scoreType);
        else
            BitmapNumber.i().changeNum(this._showScore, score, scoreType);
        this.jumpScore(x, y);
    }

    private jumpScore(x:number, y:number):void
    {
        var scoreObj:egret.DisplayObjectContainer = this._showScore;
        scoreObj.x = x;
        scoreObj.y = y;
        var targetY:number = scoreObj.y - 80;
        this.addChild(scoreObj);
        egret.Tween.removeTweens(scoreObj);
        egret.Tween.get(scoreObj).to({y:targetY}, 600, egret.Ease.cubicOut).call(function(){
            scoreObj.parent.removeChild(scoreObj);
        });
    }

    private getTouchIndexByPos(localX, localY):number
    {
        return Math.floor(localX / (GameConfig.BLOCK_WIDTH + GameConfig.BLOCK_MARGIN)) +
            Math.floor(localY / (GameConfig.BLOCK_WIDTH + GameConfig.BLOCK_MARGIN)) * GameSettings.COLUMN;
    }

    public initUI():void
    {
        this.initBg();
        this.initProgress();
        this.initBtn();
    }

    private initBtn():void
    {
        this._returnBtn = new egret.Bitmap();
        this._returnBtn.y = 10;
        this._returnBtn.touchEnabled = true;
        this._returnBtn.texture = RES.getRes("imgs.return");
        this._returnBtn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.returnToMenu, this);
        this.addChild(this._returnBtn);
    }

    private returnToMenu(e:egret.TouchEvent):void
    {
        this._timeProgress.stop();
        this.stopGame();
        EventCenter.dispatchEvent(new GameEvent(GameEvent.GAME_EVENT_GAMERESTART));
    }

    private initProgress():void
    {
        this._timeProgress = new TimeProgress();
        this._timeProgress.getProgressBar().y = 70;
        this.addChild(this._timeProgress.getProgressBar());
    }

    public startGame(difficulty:number):void
    {
        this._timeProgress.startCounting();
        this._gameScore.resetScore();
        this.setGameProperty(difficulty);
        this.createGameZone(difficulty);
        this.reposition();
    }

    private setGameProperty(difficulty:number):void
    {
        GameSettings.TYPE = difficulty;
        GameSettings.COLUMN = GameConfig.TYPE_COLUMN[difficulty];
        GameSettings.ROW = GameConfig.TYPE_ROW[difficulty];
        GameSettings.CURR_COLORS = GameConfig.TYPE_COLOR_NUM[difficulty];
    }

    private createGameZone(difficulty:number):void
    {
        BlockManager.i().setContainer(this._blockZone);
        BlockManager.i().resetData();
        BlockManager.i().fillBlocks();
        if(GameSettings.TYPE == GameConfig.TYPE_3CLEAR)
            BlockManager.i().check3Clear();
    }

    private gameOver():void
    {
        this.showShareDialogue();
    }

    private showShareDialogue():void
    {

    }

    private stopGame():void
    {

    }
}