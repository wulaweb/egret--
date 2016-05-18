/**
 * Created by Saco on 2014/8/15.
 */
class ArrayUtils{
    public static SORT_NUM_ASC:number = 0;
    public static SORT_NUM_DESC:number = 1;
    public static sortArray(arr:any[], opt?:number):any[]
    {
        if(opt == this.SORT_NUM_ASC)
            return arr.sort(this.sortAsc);
        else if(opt == this.SORT_NUM_DESC)
            return arr.sort(this.sortDesc);
        else
            return arr.sort();
    }

    private static sortAsc(t1:any, t2:any):number
    {
        if(parseInt(t1) > parseInt(t2))
            return 1;
        return -1;
    }

    private static sortDesc(t1:any, t2:any):number
    {
        if(parseInt(t1) > parseInt(t2))
            return -1;
        return 1;
    }
}
