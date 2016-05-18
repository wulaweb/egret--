/**
 * Created by Saco on 2014/7/30.
 */
class BlockManager {
    private _clearedBlockIndex:number[];
    private static _instance:BlockManager;
    private _blocks:Block[];
    private _blockPool:Block[];
    private _container:egret.DisplayObjectContainer;

    public constructor()
    {
        this._blocks = [];
        this._blockPool = [];
        this._clearedBlockIndex = [];
        EventCenter.addEventListener(GameEvent.COLLECT_BLOCK, this.collectBlock, this);
    }

    public static i():BlockManager
    {
        if (!this._instance)
            this._instance = new BlockManager();
        return this._instance;
    }

    private collectBlock(e:GameEvent):void
    {
        this.destroyBlock(e.eventBody);
    }

    private destroyBlock(block:Block):void
    {
        if(this._blockPool.indexOf(block) >= 0)
            return;
        if(block.parent)
            block.parent.removeChild(block);
        this._blockPool.push(block);
    }

    public setContainer(container:egret.DisplayObjectContainer):void
    {
        this._container = container;
    }

    public resetData():void
    {
        while (this._blocks.length > 0)
        {
            this.destroyBlock(this._blocks.shift());
        }

        this._blocks = new Array(GameSettings.ROW * GameSettings.COLUMN);
    }

    public getNewBlock(type?:number):Block
    {
        var block:Block;
        if (this._blockPool.length > 0)
        {
            block = this._blockPool.shift();
            block.reset();
        }
        else
            block = new Block();
        if(type != null)
            block.resetColor(type);
        return block;
    }

    /* 添加方块到指定单元格*/
    public addBlockAt(index:number):void
    {
        var block:Block = this.getNewBlock();
        this._blocks[index] = block;
        var pos:egret.Point = this.getPosByIndex(index);
        block.x = pos.x;
        block.y = pos.y;
        this._container.addChild(block);
        block.playFadeInAnimation();
    }

    public fillBlocks():void
    {
        var leng:number = this._blocks.length;
        for(var i:number = 0; i < leng; i++)
        {
            this.addBlockAt(i);
        }
    }

    public fillBlastedBlocks():void
    {
        while(this._clearedBlockIndex.length)
        {
            this.addBlockAt(this._clearedBlockIndex.shift());
        }
    }

    public getPosByIndex(index:number):egret.Point
    {
        var x = index%GameSettings.COLUMN * (GameConfig.BLOCK_WIDTH + GameConfig.BLOCK_MARGIN);
        var y = Math.floor(index/GameSettings.COLUMN) * (GameConfig.BLOCK_WIDTH + GameConfig.BLOCK_MARGIN);
        return new egret.Point(x, y);
    }

    public getBlockByIndex(index:number):Block
    {
        return this._blocks[index];
    }

    public blastBlock(index:number):void
    {
        this._blocks[index].blast();
    }

    public blastBlocks(indexes:number[]):void
    {
        for(var i:number = 0;i < indexes.length;i++)
        {
            this.blastBlock(indexes[i]);
        }
        this.dropBlocks(RulesManager.i().getDropIndex(indexes), indexes);
        this.fillBlastedBlocks();
        if(GameSettings.TYPE == GameConfig.TYPE_3CLEAR)
            this.check3Clear();
    }

    public dropBlocks(dropBlocks:any, blastBlocks:number[]):void
    {
        var dropArr:any[] = this.rangeDropBlock(dropBlocks);
        var posi:egret.Point;
        var toArr:number[] = [];
        for(var i:number = 0;i < dropArr.length;i ++)
        {
            posi = this.getPosByIndex(dropArr[i].to);
            this._blocks[dropArr[i].to] = this._blocks[dropArr[i].from];
            this._blocks[dropArr[i].from] = null;
            this._clearedBlockIndex.push(dropArr[i].from);//获得空白的格子
            toArr.push(dropArr[i].to);//获得空白的格子
            this._blocks[dropArr[i].to].resetProperty();
            egret.Tween.removeTweens(this._blocks[dropArr[i].to]);
            egret.Tween.get(this._blocks[dropArr[i].to]).to({x:posi.x, y:posi.y}, 150);
        }
        this._clearedBlockIndex = this._clearedBlockIndex.concat(blastBlocks);//获得空白的格子
        //获得空白的格子
        while(toArr.length)
        {
            this._clearedBlockIndex.splice(this._clearedBlockIndex.indexOf(toArr.shift()), 1);
        }
    }

    private rangeDropBlock(drop:any):any[]
    {
        var arr:any[] = [];
        for(var from in drop)
        {
            arr.push({"from":parseInt(from), "to":parseInt(drop[from])});
        }
        return arr.sort(this.sortDrop);
    }

    private sortDrop(drop1:any, drop2:any):number
    {
        if(drop1.from > drop2.from)
            return -1;
        return 1;
    }

    private switchBlock(fromIndex:number, toIndex:number, actual?:boolean):void
    {
        if(toIndex < 0)
            return;
        egret.Tween.removeTweens(this._blocks[fromIndex]);
        egret.Tween.removeTweens(this._blocks[toIndex]);
        var fromPos:egret.Point = this.getPosByIndex(fromIndex);
        var toPos:egret.Point = this.getPosByIndex(toIndex);
        if(actual)
        {
            egret.Tween.get(this._blocks[fromIndex]).to({x:toPos.x, y:toPos.y}, 150)
                .call(this.check3Clear, this);
            egret.Tween.get(this._blocks[toIndex]).to({x:fromPos.x, y:fromPos.y}, 150);
        }else{
            egret.Tween.get(this._blocks[fromIndex]).to({x:toPos.x, y:toPos.y}, 100).to({x:fromPos.x, y:fromPos.y}, 100);
            egret.Tween.get(this._blocks[toIndex]).to({x:fromPos.x, y:fromPos.y}, 100).to({x:toPos.x, y:toPos.y}, 100);
        }
    }

    public switchIndex(fromIndex:number, toIndex:number, actual?:boolean):void
    {
        this.switchBlock(fromIndex, toIndex, actual);
        if(actual)
        {
            var temp:Block = this._blocks[fromIndex];
            this._blocks[fromIndex] = this._blocks[toIndex];
            this._blocks[toIndex] = temp;
        }
    }

    public checkIfMoveCan3Clear(fromIndex:number, toIndex:number):boolean
    {
        var temp:Block = this._blocks[fromIndex];
        this._blocks[fromIndex] = this._blocks[toIndex];
        this._blocks[toIndex] = temp;
        var count:number = this.checkSingle3Clear(toIndex).length;
        var count2:number = this.checkSingle3Clear(fromIndex).length;
        this._blocks[toIndex] = this._blocks[fromIndex];
        this._blocks[fromIndex] = temp;
        if(count >= 3 || count2 >= 3)
            return true;
        else
            return false;
    }

    public check3Clear(changeArr?:number[]):void
    {
        var sound:egret.Sound
        if(changeArr != undefined)
        {
            this.checkAll3Clear();
        }else
            this.checkAll3Clear();
    }

    private checkSingle3Clear(index:number):number[]
    {
        var totalArr:number[] = [];
        var arr:number[] = [];
        var tempIndex:number = 1;
        //检查右侧
        while(this._blocks[index + tempIndex] && this._blocks[index].type == this._blocks[index + tempIndex].type && tempIndex < (GameSettings.COLUMN - (index % GameSettings.COLUMN)))
        {
            arr.push(index + tempIndex);
            tempIndex ++;
        }
        tempIndex = 1;
        //检查左侧
        while(this._blocks[index - tempIndex] && this._blocks[index].type == this._blocks[index - tempIndex].type && tempIndex <= (index % GameSettings.COLUMN))
        {
            arr.push(index - tempIndex);
            tempIndex ++;
        }
        if(arr.length >= 2)
            totalArr = totalArr.concat(arr);
        console.log("arr:"+arr+"total"+totalArr);
        arr = [];
        tempIndex = GameSettings.COLUMN;
        //检查下方
        while(this._blocks[index + tempIndex] && this._blocks[index].type == this._blocks[index + tempIndex].type && (index + tempIndex) < this._blocks.length)
        {
            arr.push(index + tempIndex);
            tempIndex += GameSettings.COLUMN;
        }
        tempIndex = GameSettings.COLUMN;
        //检查上方
        while(this._blocks[index - tempIndex] && this._blocks[index].type == this._blocks[index - tempIndex].type && (index - tempIndex) > 0)
        {
            arr.push(index - tempIndex);
            tempIndex += GameSettings.COLUMN;
        }
        if(arr.length >= 2)
            totalArr = totalArr.concat(arr);
        console.log("arr:"+arr+"total"+totalArr);
        if(totalArr.length >= 2)
            totalArr.unshift(index);
        else
            totalArr = [];
        return totalArr;
    }

    private checkAll3Clear():void
    {
        var arr:number[] = [];
        for(var i :number = 0; i < this._blocks.length; i ++)
        {
            if(arr.indexOf(i) >= 0)
                continue;
            arr = arr.concat(this.checkSingle3Clear(i));
        }
        if(arr.length)
            this.blastBlocks(arr);
        console.log("Clear======="+arr);
    }
}
