
var game_file_list = [
    //以下为自动修改，请勿修改
    //----auto game_file_list start----
	"libs/modules/egret/egret.js",
	"libs/modules/egret/egret.native.js",
	"libs/modules/game/game.js",
	"libs/modules/game/game.native.js",
	"libs/modules/tween/tween.js",
	"libs/modules/res/res.js",
	"bin-debug/GameApp.js",
	"bin-debug/LoadingUI.js",
	"bin-debug/Main.js",
	"bin-debug/base/ArrayUtils.js",
	"bin-debug/base/EventCenter.js",
	"bin-debug/base/GameEvent.js",
	"bin-debug/config/GameConfig.js",
	"bin-debug/config/GameSettings.js",
	"bin-debug/gameAssets/Block.js",
	"bin-debug/gameAssets/HotspotBitmap.js",
	"bin-debug/gameAssets/ProgressBar.js",
	"bin-debug/manager/AchieveManager.js",
	"bin-debug/manager/BitmapNumber.js",
	"bin-debug/manager/BlockManager.js",
	"bin-debug/manager/DeleyOptManager.js",
	"bin-debug/manager/RulesManager.js",
	"bin-debug/manager/ScoreManager.js",
	"bin-debug/manager/TestBitmapScale9Grid.js",
	"bin-debug/scene/GameScene.js",
	"bin-debug/scene/GameScore.js",
	"bin-debug/scene/GameShare.js",
	"bin-debug/scene/MainMenu.js",
	"bin-debug/scene/ShareArrow.js",
	"bin-debug/scene/TimeProgress.js",
	//----auto game_file_list end----
];

var window = this;

egret_native.setSearchPaths([""]);

egret_native.requireFiles = function () {
    for (var key in game_file_list) {
        var src = game_file_list[key];
        require(src);
    }
};

egret_native.egretInit = function () {
    egret_native.requireFiles();
    egret.TextField.default_fontFamily = "/system/fonts/DroidSansFallback.ttf";
    //egret.dom为空实现
    egret.dom = {};
    egret.dom.drawAsCanvas = function () {
    };
};

egret_native.egretStart = function () {
    var option = {
        //以下为自动修改，请勿修改
        //----auto option start----
		entryClassName: "Main",
		frameRate: 30,
		scaleMode: "noScale",
		contentWidth: 480,
		contentHeight: 800,
		showPaintRect: false,
		showFPS: false,
		fpsStyles: "x:0,y:0,size:30,textColor:0x00c200,bgAlpha:0.9",
		showLog: false,
		logFilter: "",
		maxTouches: 2,
		textureScaleFactor: 1
		//----auto option end----
    };

    egret.native.NativePlayer.option = option;
    egret.runEgret();
    egret_native.Label.createLabel(egret.TextField.default_fontFamily, 20, "", 0);
    egret_native.EGTView.preSetOffScreenBufferEnable(true);
};