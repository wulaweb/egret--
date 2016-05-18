/**
 * Created by Saco on 2014/8/1.
 */
var RulesManager = (function () {
    function RulesManager() {
    }
    var d = __define,c=RulesManager,p=c.prototype;
    RulesManager.i = function () {
        if (!this._instance)
            this._instance = new RulesManager();
        return this._instance;
    };
    p.checkClickedBlock = function (index) {
        return false;
    };
    p.checkIsMost = function () {
        return false;
    };
    p.getSameBlocksNearby = function (index) {
        var totalIndex = GameSettings.ROW * GameSettings.COLUMN;
        var clearArr = [];
        var type = BlockManager.i().getBlockByIndex(index).type;
        return this.checkBlockAround(index, type).concat(index);
    };
    p.checkBlockAround = function (index, type) {
        var arr = [];
        var arounds = this.getAroundIndex(index);
        var needCheck = arounds;
        var indexTemp;
        var blockChecked = [index];
        while (needCheck.length > 0) {
            indexTemp = needCheck.shift();
            if (blockChecked.indexOf(indexTemp) >= 0)
                continue;
            if (BlockManager.i().getBlockByIndex(indexTemp).type == type) {
                arr.push(indexTemp);
                needCheck = needCheck.concat(this.getAroundIndex(indexTemp));
            }
            blockChecked.push(indexTemp);
        }
        return arr;
    };
    p.getAroundIndex = function (index) {
        var arr = [];
        if (index - GameSettings.COLUMN >= 0)
            arr.push(index - GameSettings.COLUMN);
        if (index + GameSettings.COLUMN < GameSettings.COLUMN * GameSettings.ROW)
            arr.push(index + GameSettings.COLUMN);
        if (index % GameSettings.COLUMN != 0)
            arr.push(index - 1);
        if ((index + 1) % GameSettings.COLUMN != 0)
            arr.push(index + 1);
        return arr;
    };
    p.getIndexByTowards = function (index, towards) {
        if (towards == "left") {
            if ((index - 1) / GameSettings.COLUMN == 0)
                return -1;
            return index - 1;
        }
        else if (towards == "right") {
            if ((index + 1) % GameSettings.COLUMN == 0)
                return -1;
            return index + 1;
        }
        else if (towards == "up") {
            if ((index - GameSettings.COLUMN) < 0)
                return -1;
            return index - GameSettings.COLUMN;
        }
        else if (towards == "down") {
            if ((index + GameSettings.COLUMN) >= GameSettings.COLUMN * GameSettings.ROW)
                return -1;
            return index + GameSettings.COLUMN;
        }
        return -1;
    };
    p.getScoreByBlockCount = function (count) {
        return 200 * count - 100;
    };
    p.getScoreType = function (count) {
        if (count >= 10)
            return GameConfig.NUM_PIC_TYPE_YELLOW;
        else if (count >= 5)
            return GameConfig.NUM_PIC_TYPE_PURPLE;
        return GameConfig.NUM_PIC_TYPE_GREEN;
    };
    p.getDropIndex = function (indexes) {
        indexes = ArrayUtils.sortArray(indexes, ArrayUtils.SORT_NUM_DESC);
        var moveBlock = {};
        var tempIndex;
        for (var i = indexes.length - 1; i >= 0; i--) {
            tempIndex = indexes[i] - GameSettings.COLUMN;
            while (tempIndex >= 0) {
                if (indexes.indexOf(tempIndex) == -1 && BlockManager.i().getBlockByIndex(tempIndex)) {
                    if (moveBlock[tempIndex])
                        moveBlock[tempIndex] += GameSettings.COLUMN;
                    else
                        moveBlock[tempIndex] = tempIndex + GameSettings.COLUMN;
                }
                tempIndex -= GameSettings.COLUMN;
            }
        }
        return moveBlock;
    };
    p.getTimeSpeedChange = function (blockCount) {
        return blockCount - GameConfig.CLICK_PUNISH;
    };
    p.getSameBlocksCR = function (index) {
        return [];
    };
    return RulesManager;
})();
egret.registerClass(RulesManager,'RulesManager');
//# sourceMappingURL=RulesManager.js.map