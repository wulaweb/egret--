/**
 * Created by Saco on 2014/8/2.
 */
var DeleyOptManager = (function () {
    function DeleyOptManager() {
        this.TIME_THRESHOLD = 3; //每帧运算逻辑的时间阈值，执行代码超过这个时间就跳过到下一帧继续执行，根据实际情况调整，因为每一帧除了这里的逻辑还有别的逻辑要做对吧
        this._delayOpts = [];
    }
    var d = __define,c=DeleyOptManager,p=c.prototype;
    DeleyOptManager.i = function () {
        if (!this._instance)
            this._instance = new DeleyOptManager();
        return this._instance;
    };
    p.addDeleyOptFuncition = function (thisObj, fun, funPara, callBack, para) {
        this._delayOpts.push({ "fun": fun, "funPara": funPara, "thisObj": thisObj, "callBack": callBack, "para": para });
        egret.Ticker.getInstance().register(this.runCachedFun, this);
    };
    p.runCachedFun = function (f) {
        if (!this._delayOpts.length)
            egret.Ticker.getInstance().unregister(this.runCachedFun, this);
        var timeFlag = egret.getTimer();
        var funObj;
        while (this._delayOpts.length) {
            funObj = this._delayOpts.shift();
            if (funObj.funPara)
                funObj.fun.call(funObj.thisObj, [funObj.funPara]);
            else
                funObj.fun.call(funObj.thisObj);
            if (funObj.callBack) {
                if (funObj.para)
                    funObj.callBack.call(funObj.thisObj, [funObj.para]);
                else
                    funObj.callBack();
            }
            if (egret.getTimer() - timeFlag > this.TIME_THRESHOLD)
                break;
        }
    };
    return DeleyOptManager;
})();
egret.registerClass(DeleyOptManager,'DeleyOptManager');
//# sourceMappingURL=DeleyOptManager.js.map