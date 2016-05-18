/**
 * Created by Saco on 2014/8/1.
 */
class BitmapNumber
{
    private _imgPool:egret.Bitmap[];
    private _containerPool:egret.DisplayObjectContainer[];
    private static _instance:BitmapNumber;
    public constructor()
    {
        this._imgPool = [];
        this._containerPool = [];
    }

    public static i():BitmapNumber
    {
        if(!this._instance)
            this._instance = new BitmapNumber();
        return this._instance;
    }

    //根据需要的数字和类型返回一个DisplayObjectContainer
    public createNumPic(num:number, type:string):egret.DisplayObjectContainer
    {
        var container:egret.DisplayObjectContainer = this.getContainer();
        var numStr:string = num.toString();
        var index:number = 0;
        var tempBm:egret.Bitmap;
        for(index; index < numStr.length; index ++)
        {
            tempBm = this.getSingleNumPic(numStr.charAt(index), type);
            container.addChild(tempBm);
        }
        this.repositionNumPic(container);
        return container;
    }

    //回收带数字的DisplayObjectContainer
    public desstroyNumPic(picContainer:egret.DisplayObjectContainer):void
    {
        this.clearContainer(picContainer);
        if(picContainer.parent)
            picContainer.parent.removeChild(picContainer);
        this._containerPool.push(picContainer);
    }

    //改变带数字的DisplayObjectContainer数字值
    public changeNum(picContainer:egret.DisplayObjectContainer, num:number, type:string):void
    {
        var numStr:string = num.toString();
        var tempBm:egret.Bitmap;
        //如果当前数字个数多于目标个数则把多余的回收
        if(picContainer.numChildren > numStr.length)
        {
            while(picContainer.numChildren > numStr.length)
            {
                this.recycleBM(<egret.Bitmap>picContainer.getChildAt(picContainer.numChildren - 1))
            }
        }
        var index:number = 0;
        var tempStr:string;
        for(index; index < numStr.length; index ++)
        {
            //如果当前的Bitmap数量不够则获取新的Bitmap补齐
            if(index >= picContainer.numChildren)
                picContainer.addChild(this.getBitmap());
            tempStr = numStr.charAt(index);
            tempStr = tempStr == "." ? "dot" : tempStr;
            (<egret.Bitmap>picContainer.getChildAt(index)).texture = RES.getRes(type + tempStr);
        }
        this.repositionNumPic(picContainer);
    }

    //每个数字宽度不一样，所以重新排列
    private repositionNumPic(container:egret.DisplayObjectContainer):void
    {
        var index:number = 0;
        var lastX:number = 0;
        var temp:egret.DisplayObject;
        for(index; index < container.numChildren; index++)
        {
            temp = container.getChildAt(index);
            temp.x = lastX;
            lastX = temp.x + temp.width;
        }
    }

    //清理容器
    private clearContainer(picContainer:egret.DisplayObjectContainer):void
    {
        while(picContainer.numChildren)
        {
            this.recycleBM(<egret.Bitmap>picContainer.removeChildAt(0));
        }
    }

    //回收Bitmap
    private recycleBM(bm:egret.Bitmap):void
    {
        if(bm && bm.parent)
        {
            bm.parent.removeChild(bm);
            bm.texture = null;
            this._imgPool.push(bm);
        }
    }

    private getContainer():egret.DisplayObjectContainer
    {
        if(this._containerPool.length)
            return this._containerPool.shift();
        return new egret.DisplayObjectContainer();
    }

    //获得单个数字Bitmap
    private getSingleNumPic(num:string, type:string):egret.Bitmap
    {
        if(num == ".")
            num = "dot";
        var bm:egret.Bitmap = this.getBitmap();
        bm.texture = RES.getRes(type + num);
        return bm;
    }

    private getBitmap():egret.Bitmap
    {
        if(this._imgPool.length)
            return this._imgPool.shift();
        return new egret.Bitmap();
    }
}
