/**
 * Created by Saco on 2014/7/30.
 */
var BlockManager = (function () {
    function BlockManager() {
        this._blocks = [];
        this._blockPool = [];
        this._clearedBlockIndex = [];
        EventCenter.addEventListener(GameEvent.COLLECT_BLOCK, this.collectBlock, this);
    }
    var d = __define,c=BlockManager,p=c.prototype;
    BlockManager.i = function () {
        if (!this._instance)
            this._instance = new BlockManager();
        return this._instance;
    };
    p.collectBlock = function (e) {
        this.destroyBlock(e.eventBody);
    };
    p.destroyBlock = function (block) {
        if (this._blockPool.indexOf(block) >= 0)
            return;
        if (block.parent)
            block.parent.removeChild(block);
        this._blockPool.push(block);
    };
    p.setContainer = function (container) {
        this._container = container;
    };
    p.resetData = function () {
        while (this._blocks.length > 0) {
            this.destroyBlock(this._blocks.shift());
        }
        this._blocks = new Array(GameSettings.ROW * GameSettings.COLUMN);
    };
    p.getNewBlock = function (type) {
        var block;
        if (this._blockPool.length > 0) {
            block = this._blockPool.shift();
            block.reset();
        }
        else
            block = new Block();
        if (type != null)
            block.resetColor(type);
        return block;
    };
    /* 添加方块到指定单元格*/
    p.addBlockAt = function (index) {
        var block = this.getNewBlock();
        this._blocks[index] = block;
        var pos = this.getPosByIndex(index);
        block.x = pos.x;
        block.y = pos.y;
        this._container.addChild(block);
        block.playFadeInAnimation();
    };
    p.fillBlocks = function () {
        var leng = this._blocks.length;
        for (var i = 0; i < leng; i++) {
            this.addBlockAt(i);
        }
    };
    p.fillBlastedBlocks = function () {
        while (this._clearedBlockIndex.length) {
            this.addBlockAt(this._clearedBlockIndex.shift());
        }
    };
    p.getPosByIndex = function (index) {
        var x = index % GameSettings.COLUMN * (GameConfig.BLOCK_WIDTH + GameConfig.BLOCK_MARGIN);
        var y = Math.floor(index / GameSettings.COLUMN) * (GameConfig.BLOCK_WIDTH + GameConfig.BLOCK_MARGIN);
        return new egret.Point(x, y);
    };
    p.getBlockByIndex = function (index) {
        return this._blocks[index];
    };
    p.blastBlock = function (index) {
        this._blocks[index].blast();
    };
    p.blastBlocks = function (indexes) {
        for (var i = 0; i < indexes.length; i++) {
            this.blastBlock(indexes[i]);
        }
        this.dropBlocks(RulesManager.i().getDropIndex(indexes), indexes);
        this.fillBlastedBlocks();
        if (GameSettings.TYPE == GameConfig.TYPE_3CLEAR)
            this.check3Clear();
    };
    p.dropBlocks = function (dropBlocks, blastBlocks) {
        var dropArr = this.rangeDropBlock(dropBlocks);
        var posi;
        var toArr = [];
        for (var i = 0; i < dropArr.length; i++) {
            posi = this.getPosByIndex(dropArr[i].to);
            this._blocks[dropArr[i].to] = this._blocks[dropArr[i].from];
            this._blocks[dropArr[i].from] = null;
            this._clearedBlockIndex.push(dropArr[i].from); //获得空白的格子
            toArr.push(dropArr[i].to); //获得空白的格子
            this._blocks[dropArr[i].to].resetProperty();
            egret.Tween.removeTweens(this._blocks[dropArr[i].to]);
            egret.Tween.get(this._blocks[dropArr[i].to]).to({ x: posi.x, y: posi.y }, 150);
        }
        this._clearedBlockIndex = this._clearedBlockIndex.concat(blastBlocks); //获得空白的格子
        //获得空白的格子
        while (toArr.length) {
            this._clearedBlockIndex.splice(this._clearedBlockIndex.indexOf(toArr.shift()), 1);
        }
    };
    p.rangeDropBlock = function (drop) {
        var arr = [];
        for (var from in drop) {
            arr.push({ "from": parseInt(from), "to": parseInt(drop[from]) });
        }
        return arr.sort(this.sortDrop);
    };
    p.sortDrop = function (drop1, drop2) {
        if (drop1.from > drop2.from)
            return -1;
        return 1;
    };
    p.switchBlock = function (fromIndex, toIndex, actual) {
        if (toIndex < 0)
            return;
        egret.Tween.removeTweens(this._blocks[fromIndex]);
        egret.Tween.removeTweens(this._blocks[toIndex]);
        var fromPos = this.getPosByIndex(fromIndex);
        var toPos = this.getPosByIndex(toIndex);
        if (actual) {
            egret.Tween.get(this._blocks[fromIndex]).to({ x: toPos.x, y: toPos.y }, 150)
                .call(this.check3Clear, this);
            egret.Tween.get(this._blocks[toIndex]).to({ x: fromPos.x, y: fromPos.y }, 150);
        }
        else {
            egret.Tween.get(this._blocks[fromIndex]).to({ x: toPos.x, y: toPos.y }, 100).to({ x: fromPos.x, y: fromPos.y }, 100);
            egret.Tween.get(this._blocks[toIndex]).to({ x: fromPos.x, y: fromPos.y }, 100).to({ x: toPos.x, y: toPos.y }, 100);
        }
    };
    p.switchIndex = function (fromIndex, toIndex, actual) {
        this.switchBlock(fromIndex, toIndex, actual);
        if (actual) {
            var temp = this._blocks[fromIndex];
            this._blocks[fromIndex] = this._blocks[toIndex];
            this._blocks[toIndex] = temp;
        }
    };
    p.checkIfMoveCan3Clear = function (fromIndex, toIndex) {
        var temp = this._blocks[fromIndex];
        this._blocks[fromIndex] = this._blocks[toIndex];
        this._blocks[toIndex] = temp;
        var count = this.checkSingle3Clear(toIndex).length;
        var count2 = this.checkSingle3Clear(fromIndex).length;
        this._blocks[toIndex] = this._blocks[fromIndex];
        this._blocks[fromIndex] = temp;
        if (count >= 3 || count2 >= 3)
            return true;
        else
            return false;
    };
    p.check3Clear = function (changeArr) {
        var sound;
        if (changeArr != undefined) {
            this.checkAll3Clear();
        }
        else
            this.checkAll3Clear();
    };
    p.checkSingle3Clear = function (index) {
        var totalArr = [];
        var arr = [];
        var tempIndex = 1;
        //检查右侧
        while (this._blocks[index + tempIndex] && this._blocks[index].type == this._blocks[index + tempIndex].type && tempIndex < (GameSettings.COLUMN - (index % GameSettings.COLUMN))) {
            arr.push(index + tempIndex);
            tempIndex++;
        }
        tempIndex = 1;
        //检查左侧
        while (this._blocks[index - tempIndex] && this._blocks[index].type == this._blocks[index - tempIndex].type && tempIndex <= (index % GameSettings.COLUMN)) {
            arr.push(index - tempIndex);
            tempIndex++;
        }
        if (arr.length >= 2)
            totalArr = totalArr.concat(arr);
        console.log("arr:" + arr + "total" + totalArr);
        arr = [];
        tempIndex = GameSettings.COLUMN;
        //检查下方
        while (this._blocks[index + tempIndex] && this._blocks[index].type == this._blocks[index + tempIndex].type && (index + tempIndex) < this._blocks.length) {
            arr.push(index + tempIndex);
            tempIndex += GameSettings.COLUMN;
        }
        tempIndex = GameSettings.COLUMN;
        //检查上方
        while (this._blocks[index - tempIndex] && this._blocks[index].type == this._blocks[index - tempIndex].type && (index - tempIndex) > 0) {
            arr.push(index - tempIndex);
            tempIndex += GameSettings.COLUMN;
        }
        if (arr.length >= 2)
            totalArr = totalArr.concat(arr);
        console.log("arr:" + arr + "total" + totalArr);
        if (totalArr.length >= 2)
            totalArr.unshift(index);
        else
            totalArr = [];
        return totalArr;
    };
    p.checkAll3Clear = function () {
        var arr = [];
        for (var i = 0; i < this._blocks.length; i++) {
            if (arr.indexOf(i) >= 0)
                continue;
            arr = arr.concat(this.checkSingle3Clear(i));
        }
        if (arr.length)
            this.blastBlocks(arr);
        console.log("Clear=======" + arr);
    };
    return BlockManager;
})();
egret.registerClass(BlockManager,'BlockManager');
//# sourceMappingURL=BlockManager.js.map