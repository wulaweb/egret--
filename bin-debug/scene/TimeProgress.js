/**
 * Created by Saco on 2014/8/12.
 */
var TimeProgress = (function () {
    function TimeProgress() {
        this.progressReduceSpeed = 100;
        //TODO Timer倒计时是不准的，抽时间写个准确的倒计时工具
        this._timer = new egret.Timer(1000);
        this._timer.addEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
        this.initProgressBar();
    }
    var d = __define,c=TimeProgress,p=c.prototype;
    p.startCounting = function () {
        this.start();
    };
    p.onTimer = function (e) {
        this.reduceProgress(this.progressReduceSpeed);
    };
    p.start = function () {
        this._progressBar.reset();
        this.progressLeft = GameConfig.TOTAL_TIME_NUM;
        this.progressReduceSpeed = GameConfig.TIME_SPEED_DEFAULT;
        this.reduceProgress(this.progressReduceSpeed);
        this._timer.start();
    };
    p.stop = function () {
        this._timer.reset();
        this._timer.stop();
        egret.clearTimeout(this._timeOut);
    };
    p.over = function () {
        EventCenter.dispatchEvent(new GameEvent(GameEvent.GAME_EVENT_GAMEOVER));
    };
    p.initProgressBar = function () {
        this._progressBar = new ProgressBar(480);
    };
    p.getProgressBar = function () {
        return this._progressBar;
    };
    p.addProgress = function (count) {
        this.progressLeft += count;
        this.updateProgress();
    };
    p.reduceProgress = function (count) {
        this.progressLeft -= count;
        this.updateProgress();
    };
    p.updateProgress = function () {
        this._progressBar.setProgress(this.progressLeft, GameConfig.TOTAL_TIME_NUM);
        if (this._progressBar.getProgress() <= 0) {
            this.stop();
            this._timeOut = egret.setTimeout(this.over, this, 1000);
        }
        if (this.progressLeft > GameConfig.TOTAL_TIME_NUM)
            this.progressLeft = GameConfig.TOTAL_TIME_NUM;
    };
    p.changeTimeSpeed = function (count) {
        this.progressReduceSpeed -= count;
        this.progressReduceSpeed = this.progressReduceSpeed < GameConfig.TIME_SPEED_DEFAULT ? GameConfig.TIME_SPEED_DEFAULT : this.progressReduceSpeed;
    };
    return TimeProgress;
})();
egret.registerClass(TimeProgress,'TimeProgress');
//# sourceMappingURL=TimeProgress.js.map