/**
 * Created by Saco on 2014/8/12.
 */
class TimeProgress
{
    public progressLeft:number;
    public progressReduceSpeed:number = 100;
    private _progressBar:ProgressBar;
    private _timer:egret.Timer;
    private _timeOut:number;

    public constructor()
    {
        //TODO Timer倒计时是不准的，抽时间写个准确的倒计时工具
        this._timer = new egret.Timer(1000);
        this._timer.addEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
        this.initProgressBar();
    }

    public startCounting():void
    {
        this.start();
    }

    private onTimer(e:egret.TimerEvent):void
    {
        this.reduceProgress(this.progressReduceSpeed);
    }

    private start():void
    {
        this._progressBar.reset();
        this.progressLeft = GameConfig.TOTAL_TIME_NUM;
        this.progressReduceSpeed = GameConfig.TIME_SPEED_DEFAULT;
        this.reduceProgress(this.progressReduceSpeed);
        this._timer.start();
    }

    public stop():void
    {
        this._timer.reset();
        this._timer.stop();
        egret.clearTimeout(this._timeOut);
    }

    private over():void
    {
        EventCenter.dispatchEvent(new GameEvent(GameEvent.GAME_EVENT_GAMEOVER));
    }

    private initProgressBar():void
    {
        this._progressBar = new ProgressBar(480);
    }

    public getProgressBar():ProgressBar
    {
        return this._progressBar;
    }

    public addProgress(count:number):void
    {
        this.progressLeft += count;
        this.updateProgress();
    }

    public reduceProgress(count:number):void
    {
        this.progressLeft -= count;
        this.updateProgress();
    }

    private updateProgress():void
    {
        this._progressBar.setProgress(this.progressLeft, GameConfig.TOTAL_TIME_NUM);
        if(this._progressBar.getProgress() <= 0)
        {
            this.stop();
            this._timeOut = egret.setTimeout(this.over, this, 1000);
        }
        if(this.progressLeft > GameConfig.TOTAL_TIME_NUM)
            this.progressLeft = GameConfig.TOTAL_TIME_NUM;
    }

    public changeTimeSpeed(count:number):void
    {
        this.progressReduceSpeed -= count;
        this.progressReduceSpeed = this.progressReduceSpeed < GameConfig.TIME_SPEED_DEFAULT ? GameConfig.TIME_SPEED_DEFAULT : this.progressReduceSpeed;
    }
}
