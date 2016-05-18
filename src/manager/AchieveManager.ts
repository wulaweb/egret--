/**
 * Created by Saco on 2014/8/17.
 */
class AchieveManager
{
    private _clickCount:number;
    private _mostBlock:number;
    private _timeFlag:number;
    private _defaleTitle:string[] = ["海盗船长", "粉红娘娘", "德玛西亚", "五秒真男人", "瑞萌萌",
        "提莫大队长", "探险家", "巡山小妖", "奔波儿灞", "灞波儿奔", "二师兄", "熊猫酒仙",
        "拍拍熊", "菊花残", "蓝色妖姬", "绿菊人", "之猪侠", "钢铁侠", "金缸狼", "蓝铃王",
        "豁影忍者", "剩斗士", "弑君者", "北境守护", "沧老师", "金刚葫芦娃", "美少履战士", "汤姆猫"];
    private static _instance:AchieveManager;
    public constructor()
    {
    }

    public static i():AchieveManager
    {
        if(!this._instance)
            this._instance = new AchieveManager();
        return this._instance;
    }

    public start():void
    {
        this._clickCount = 0;
        this._mostBlock = 0;
        this._timeFlag = egret.getTimer();
    }

    public recordData(count:number, type:number):void
    {
        this._clickCount ++;
        this._mostBlock = this._mostBlock > count ? this._mostBlock : count;
    }

    public getTitle():any
    {
        var time:number = (this._timeFlag-egret.getTimer());
        var apm:number = this._clickCount/(time/1000*60);
        if(GameScore.score < 100000)
        {
            return {"others":"我是打酱油的！",
                "self":"你没看错，就是这么点分！不管怎样还是送个称号吧\n“打酱油的”"};
        }
        if(time > 120000)
        {
            var timeStr:string = Math.floor(time/1000/60)+"分"+time/1000%60+"秒";
            return {"others":"是男人就要坚持2分钟，我坚持了"+timeStr+"，你呢？",
                "self":"太厉害了，居然坚持了"+timeStr+"!获得称号\n“真男人”"};
        }
        if(apm >= 100 && egret.getTimer()%2 == 0)
        {
            return {"others":"我APM"+apm+"，不服SALA！", "self":"APM"+apm+"!获得称号\n“超神”"};
        }
        if(this._mostBlock >= 13 && egret.getTimer()%3 == 0)
        {
            return {"others":"我竟然一次消除了"+this._mostBlock+"个方块，请叫我“消"+this._mostBlock+"郎”！","self":"最高单次消除了" +
                this._mostBlock + "个方块，获得称号\n“消"+ this._mostBlock +"郎”"};
        }
        if(egret.getTimer()%1000 == 0)
        {
            return {"others":"我是那天选之人，将来维护宇宙正义与和平的重任就靠我了！","self":"我看你骨骼惊奇,必是练武奇才,将来维护宇宙正义与和平的重任就交给你了!"};
        }
        var titleStr:string = this._defaleTitle[Math.floor(Math.random()*this._defaleTitle.length)];
        return {"others":"原来我是“" + titleStr + "”，你也快来试试吧！","self":"击败了XX%对手\n获得称号\n“" + titleStr + "”"};
    }
}
