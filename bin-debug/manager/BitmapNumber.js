/**
 * Created by Saco on 2014/8/1.
 */
var BitmapNumber = (function () {
    function BitmapNumber() {
        this._imgPool = [];
        this._containerPool = [];
    }
    var d = __define,c=BitmapNumber,p=c.prototype;
    BitmapNumber.i = function () {
        if (!this._instance)
            this._instance = new BitmapNumber();
        return this._instance;
    };
    //根据需要的数字和类型返回一个DisplayObjectContainer
    p.createNumPic = function (num, type) {
        var container = this.getContainer();
        var numStr = num.toString();
        var index = 0;
        var tempBm;
        for (index; index < numStr.length; index++) {
            tempBm = this.getSingleNumPic(numStr.charAt(index), type);
            container.addChild(tempBm);
        }
        this.repositionNumPic(container);
        return container;
    };
    //回收带数字的DisplayObjectContainer
    p.desstroyNumPic = function (picContainer) {
        this.clearContainer(picContainer);
        if (picContainer.parent)
            picContainer.parent.removeChild(picContainer);
        this._containerPool.push(picContainer);
    };
    //改变带数字的DisplayObjectContainer数字值
    p.changeNum = function (picContainer, num, type) {
        var numStr = num.toString();
        var tempBm;
        //如果当前数字个数多于目标个数则把多余的回收
        if (picContainer.numChildren > numStr.length) {
            while (picContainer.numChildren > numStr.length) {
                this.recycleBM(picContainer.getChildAt(picContainer.numChildren - 1));
            }
        }
        var index = 0;
        var tempStr;
        for (index; index < numStr.length; index++) {
            //如果当前的Bitmap数量不够则获取新的Bitmap补齐
            if (index >= picContainer.numChildren)
                picContainer.addChild(this.getBitmap());
            tempStr = numStr.charAt(index);
            tempStr = tempStr == "." ? "dot" : tempStr;
            picContainer.getChildAt(index).texture = RES.getRes(type + tempStr);
        }
        this.repositionNumPic(picContainer);
    };
    //每个数字宽度不一样，所以重新排列
    p.repositionNumPic = function (container) {
        var index = 0;
        var lastX = 0;
        var temp;
        for (index; index < container.numChildren; index++) {
            temp = container.getChildAt(index);
            temp.x = lastX;
            lastX = temp.x + temp.width;
        }
    };
    //清理容器
    p.clearContainer = function (picContainer) {
        while (picContainer.numChildren) {
            this.recycleBM(picContainer.removeChildAt(0));
        }
    };
    //回收Bitmap
    p.recycleBM = function (bm) {
        if (bm && bm.parent) {
            bm.parent.removeChild(bm);
            bm.texture = null;
            this._imgPool.push(bm);
        }
    };
    p.getContainer = function () {
        if (this._containerPool.length)
            return this._containerPool.shift();
        return new egret.DisplayObjectContainer();
    };
    //获得单个数字Bitmap
    p.getSingleNumPic = function (num, type) {
        if (num == ".")
            num = "dot";
        var bm = this.getBitmap();
        bm.texture = RES.getRes(type + num);
        return bm;
    };
    p.getBitmap = function () {
        if (this._imgPool.length)
            return this._imgPool.shift();
        return new egret.Bitmap();
    };
    return BitmapNumber;
})();
egret.registerClass(BitmapNumber,'BitmapNumber');
//# sourceMappingURL=BitmapNumber.js.map