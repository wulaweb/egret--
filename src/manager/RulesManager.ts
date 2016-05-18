/**
 * Created by Saco on 2014/8/1.
 */
class RulesManager
{
    private static _instance:RulesManager;
    public constructor()
    {

    }

    public static i():RulesManager
    {
        if(!this._instance)
            this._instance = new RulesManager();
        return this._instance;
    }

    public checkClickedBlock(index:number):Boolean
    {
        return false;
    }

    private checkIsMost():Boolean
    {
        return false;
    }

    public getSameBlocksNearby(index:number):number[]
    {
        var totalIndex:number = GameSettings.ROW * GameSettings.COLUMN;
        var clearArr:number[] = [];
        var type:number = BlockManager.i().getBlockByIndex(index).type;
        return this.checkBlockAround(index, type).concat(index);
    }

    private checkBlockAround(index:number, type:number):number[]
    {
        var arr:number[] = [];
        var arounds:number[] = this.getAroundIndex(index);
        var needCheck:number[] = arounds;
        var indexTemp:number;
        var blockChecked:number[] = [index];
        while(needCheck.length > 0)
        {
            indexTemp = needCheck.shift();
            if(blockChecked.indexOf(indexTemp) >= 0)
                continue;
            if(BlockManager.i().getBlockByIndex(indexTemp).type == type)
            {
                arr.push(indexTemp);
                needCheck = needCheck.concat(this.getAroundIndex(indexTemp));
            }
            blockChecked.push(indexTemp);
        }
        return arr;
    }

    private getAroundIndex(index:number):number[]
    {
        var arr:number[] = [];
        if(index - GameSettings.COLUMN >= 0)    //up
            arr.push(index - GameSettings.COLUMN);
        if(index + GameSettings.COLUMN < GameSettings.COLUMN * GameSettings.ROW)   //down
            arr.push(index + GameSettings.COLUMN);
        if(index % GameSettings.COLUMN != 0)    //left
            arr.push(index - 1);
        if((index + 1) % GameSettings.COLUMN != 0)  //right
            arr.push(index + 1);
        return arr;
    }

    public getIndexByTowards(index:number, towards:string):number
    {
        if(towards == "left")
        {
            if((index - 1)/GameSettings.COLUMN == 0)
                return -1;
            return index - 1;
        }else if(towards == "right")
        {
            if((index + 1) % GameSettings.COLUMN == 0)
                return -1;
            return index + 1;
        }else if(towards == "up")
        {
            if((index - GameSettings.COLUMN) < 0)
                return -1;
            return index - GameSettings.COLUMN;
        }else if(towards == "down")
        {
            if((index + GameSettings.COLUMN) >= GameSettings.COLUMN * GameSettings.ROW)
                return -1;
            return index + GameSettings.COLUMN;
        }
        return -1;
    }

    public getScoreByBlockCount(count:number):number
    {
        return 200*count-100;
    }

    public getScoreType(count:number):string
    {
        if(count >= 10)
            return GameConfig.NUM_PIC_TYPE_YELLOW;
        else if(count >= 5)
            return GameConfig.NUM_PIC_TYPE_PURPLE;
        return GameConfig.NUM_PIC_TYPE_GREEN;
    }

    public getDropIndex(indexes:number[]):any
    {
        indexes = ArrayUtils.sortArray(indexes, ArrayUtils.SORT_NUM_DESC);
        var moveBlock:any = {};
        var tempIndex:number;
        for(var i:number = indexes.length - 1;i >= 0;i--)
        {
            tempIndex = indexes[i] - GameSettings.COLUMN;
            while(tempIndex >= 0)
            {
                if(indexes.indexOf(tempIndex) == -1 && BlockManager.i().getBlockByIndex(tempIndex))
                {
                    if(moveBlock[tempIndex])
                        moveBlock[tempIndex] += GameSettings.COLUMN;
                    else
                        moveBlock[tempIndex] = tempIndex + GameSettings.COLUMN;
                }
                tempIndex -= GameSettings.COLUMN;
            }
        }
        return moveBlock;
    }

    public getTimeSpeedChange(blockCount:number):number
    {
        return blockCount - GameConfig.CLICK_PUNISH;
    }

    public getSameBlocksCR(index:number):number[]
    {
        return [];
    }
}
