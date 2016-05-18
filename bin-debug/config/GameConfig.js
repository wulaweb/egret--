/**
 * Created by Saco on 2014/7/30.
 */
var GameConfig = (function () {
    function GameConfig() {
    }
    var d = __define,c=GameConfig,p=c.prototype;
    GameConfig.BLOCK_WIDTH = 80;
    GameConfig.TYPE_DES = 0;
    GameConfig.TYPE_3CLEAR = 1;
    GameConfig.TYPE_COLUMN = [5, 5, 6];
    GameConfig.TYPE_ROW = [7, 7, 8];
    GameConfig.TYPE_COLOR_NUM = [4, 7, 5];
    GameConfig.COLORS = [0xa26bd8, 0xa7cb57, 0x5bd1e8, 0xfaf168, 0xe84765, 0xeda037, 0x42e6be];
    GameConfig.COLOR_NAME = ["紫色", "绿色", "蓝色", "黄色", "红色", "橙色", "青色"];
    GameConfig.NUM_PIC_TYPE_GREEN = "g";
    GameConfig.NUM_PIC_TYPE_PURPLE = "p";
    GameConfig.NUM_PIC_TYPE_YELLOW = "y";
    GameConfig.BLOCK_MARGIN = 1;
    GameConfig.TOP_MARGIN = 100;
    GameConfig.TOTAL_TIME_NUM = 1500;
    GameConfig.TIME_SPEED_DEFAULT = 10;
    GameConfig.CLICK_PUNISH = 5;
    GameConfig.TOUCH_MOVE_LENGTH = 40;
    return GameConfig;
})();
egret.registerClass(GameConfig,'GameConfig');
//# sourceMappingURL=GameConfig.js.map