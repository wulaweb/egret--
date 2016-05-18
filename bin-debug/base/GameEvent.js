/**
 * Created by Saco on 2014/8/2.
 */
var GameEvent = (function (_super) {
    __extends(GameEvent, _super);
    function GameEvent(type, body) {
        this.type = type;
        this.eventBody = body;
        _super.call(this, type);
    }
    var d = __define,c=GameEvent,p=c.prototype;
    GameEvent.GAME_EVENT_GAMEOVER = "game_over";
    GameEvent.GAME_EVENT_GAMESTART = "game_start";
    GameEvent.GAME_EVENT_GAMERESTART = "game_restart";
    GameEvent.GAME_EVENT_SHARE = "game_share";
    GameEvent.COLLECT_BLOCK = "collect_block";
    return GameEvent;
})(egret.Event);
egret.registerClass(GameEvent,'GameEvent');
//# sourceMappingURL=GameEvent.js.map