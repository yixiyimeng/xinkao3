import {
	app,
	Menu,
	Tray,
	BrowserWindow,
	dialog,
	ipcMain,
	globalShortcut,
	screen,
	clipboard
} from 'electron';
import path from 'path';
import fs from 'fs';
import electron from 'electron';


let tray = null;

if (process.env.NODE_ENV !== 'development') {
	global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\');
}

let mainWindow;
var win = null;
//const winURL = process.env.NODE_ENV === 'development' ? `http://localhost:9080` : `file://${__dirname}/index.html`;
const winURL = process.env.NODE_ENV === 'development' ?
	'http://localhost:9080/mainPage' :
	`file://${__dirname}/mainPage/index.html`;
const subwinURL = process.env.NODE_ENV === 'development' ? 'http://localhost:9080/newPage' :
	`file://${__dirname}/newPage/index.html`;
/**
 * Create main window
 */
let iswinsm = true;

function createWindow() {
	mainWindow = new BrowserWindow({
		height: 1080,
		useContentSize: true,
		width: 1920,
		titleBarStyle: 'hidden-inset',
		frame: false,
		transparent: true,
		// fullscreenable: true,
		// fullscreen: true,
		// simpleFullscreen: true,
		resizable: false,
		hasShadow: false,
		webPreferences: {
			webSecurity: false
		},
		id: 'mainWindow',
		// maximizable: false,
		// minimizable: false
	});
	mainWindow.loadURL(winURL);
	/* 打开悬浮窗口 */
	createSuspensionWindow();
	mainWindow.on('closed', () => {
		mainWindow = null
	});
	mainWindow.on('close', (e) => {
		e.preventDefault();
		if (mainWindow.isMinimized()) {
			mainWindow.show();
			mainWindow.maximize();
			// mainWindow.setFullScreen(true);
		}
		mainWindow.webContents.send('isexitApp');
	});
	mainWindow.maximize();
	// mainWindow.setFullScreen(true); //设置全屏
	// mainWindow.setAlwaysOnTop(true);
	/* 窗口退出最小化的时候，通知页面，暂停弹幕 */
	mainWindow.on('minimize', (e) => {
		mainWindow.webContents.send('isminimizeApp', true);
		win.webContents.send('isminimizeAppsub', true);

	});
	/* 在窗口从最小化恢复的时候触发,通知页面，恢复弹幕 */
	mainWindow.on('restore', (e) => {
		mainWindow.maximize();
		win.moveTop();
		// mainWindow.setFullScreen(true);
		mainWindow.webContents.send('isminimizeApp', false);
		win.webContents.send('isminimizeAppsub', false);

	});

	/* 调试 */
	globalShortcut.register('CTRL+T', () => {
		//mainWindow.setFullScreen(false);
		mainWindow.webContents.openDevTools({
			mode: 'bottom'
		})
	})
	/* 调试 */
	globalShortcut.register('SHIFT+T', () => {
		//mainWindow.setFullScreen(false);
		win.webContents.openDevTools({
			mode: 'bottom'
		})
	})
	globalShortcut.register('SHIFT+Q', () => {
		//mainWindow.setFullScreen(false);
		//mainWindow.webContents.openDevTools({mode:'bottom'})
		mainWindow.minimize()
	})
	globalShortcut.register('SHIFT+M', () => {
		mainWindow.show();
		// mainWindow.setFullScreen(true);
		mainWindow.maximize();
		win.moveTop()
		//mainWindow.webContents.openDevTools({mode:'bottom'})
	})

}

function createSuspensionWindow() {
	win = new BrowserWindow({
		width: 70, //悬浮窗口的宽度 比实际DIV的宽度要多2px 因为有1px的边框
		height: 60, //悬浮窗口的高度 比实际DIV的高度要多2px 因为有1px的边框
		type: 'toolbar', //创建的窗口类型为工具栏窗口
		frame: false, //要创建无边框窗口
		resizable: true, //禁止窗口大小缩放
		show: false, //先不让窗口显示
		webPreferences: {
			devTools: true //关闭调试工具
		},
		useContentSize: true,
		maxWidth: 70,
		maxHeight: 220,
		transparent: true, //设置透明
		alwaysOnTop: true, //窗口是否总是显示在其他窗口之前
	});
	const size = screen.getPrimaryDisplay().workAreaSize; //获取显示器的宽高
	const winSize = win.getSize(); //获取窗口宽高

	//设置窗口的位置 注意x轴要桌面的宽度 - 窗口的宽度
	win.setPosition(size.width - winSize[0], size.height - winSize[1] - 260);
	win.loadURL(subwinURL);

	win.once('ready-to-show', () => {
		win.show()
	});

	win.on('close', () => {
		win = null;
	});
	win.on('resize', (e) => {
		win.webContents.send('isresize', iswinsm);
	});
	win.on('will-resize', (e) => {
		e.preventDefault();
	});


}
/**
 * Create Tray
 */
function createTray() {
	let iconPath = path.join(__static, 'icons/icon7.png');
	tray = new Tray(iconPath);
	const contextMenu = Menu.buildFromTemplate([{ //小图标选项类型
			label: '打开',
			type: 'normal',
			click: onOpenAppClick
		},
		{
			label: '退出',
			type: 'normal',
			// role: 'quit'
			click: onExitAppClick
		}
	]);
	contextMenu.items[1].checked = false;
	tray.setContextMenu(contextMenu);
	tray.setToolTip("答题器");
	tray.on('double-click', () => {
		// mainWindow.isVisible() ? mainWindow.hide() : {mainWindow.show();mainWindow.setFullScreen(true);}
		mainWindow.show();
		// mainWindow.setFullScreen(true);
		mainWindow.maximize();
		win.moveTop()
	})
}

/**
 * when choose folder btn click
 */
function onOpenAppClick() {
	// 	const musicPaths = dialog.showOpenDialog({
	// 		properties: ['openDirectory']
	// 	});
	// 	if (musicPaths != null && musicPaths != 'undefined') {
	// 		sendMusicList(musicPaths);
	// 	}
	mainWindow.show();
	// mainWindow.setFullScreen(true);
	mainWindow.maximize();
	win.moveTop()
}

function onExitAppClick() {
	if (mainWindow.isMinimized()) {
		mainWindow.show();
		mainWindow.setFullScreen(true);
	}
	mainWindow.webContents.send('isexitApp')
}

/**
 * Get music tags such as title adn artist
 * @param fullPath file path
 * @returns {Promise}
 */
function getTags(fullPath) {
	return new Promise((resolve, reject) => {
		new jsmediatags.Reader(fullPath).setTagsToRead(["title", "artist"]).read({
			onSuccess: ({
				tags
			}) => {
				resolve(tags);
			}
		});
	})
}
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
	app.exit()
} else {
	app.on('second-instance', (event, commandLine, workingDirectory) => {
		// 当运行第二个实例时,将会聚焦到myWindow这个窗口
		if (mainWindow) {
			if (mainWindow.isMinimized()) mainWindow.restore()
			// myWindow.focus()
		}
	})
}
/**
 * On ready
 * ----------------------
 * 1. create tray
 * 2. create window
 * 3. listen ,if vue is ready ,get the music path and set the music list
 */
app.on('ready', () => {
	createTray();
	// new musicServer().start();
	createWindow();

	ipcMain.on("exitApp", () => {
		if (process.platform !== 'darwin') {
			//app.quit()
			app.exit();
		}
	});

	ipcMain.on('minApp', e => mainWindow.minimize());
	ipcMain.on('maxApp', e => mainWindow.show());
	/* 是否退出软件 */
	ipcMain.on('isexitApp', e => {
		mainWindow.webContents.send('isexitApp');
		if (mainWindow.isMinimized()) {
			mainWindow.show();
			mainWindow.maximize();
			// mainWindow.setFullScreen(true);
		}
	});
	/* 是否上传题目 */
	ipcMain.on('isuploadTitle', e => {
		mainWindow.webContents.send('isuploadTitle');
		mainWindow.show();
		mainWindow.setFullScreen(true);
	});
	/* 是否退出直播间 */
	ipcMain.on('isexitdirebro', e => {
		mainWindow.webContents.send('exitdirebro');
	});
	/* 直播间状态 */
	ipcMain.on('onlinedirebro', (e, value) => {
		win.webContents.send('onlinedirebro', value);
	});
	/* 上传文件状态 */
	ipcMain.on('uploadfile', (e, value) => {
		win.webContents.send('isUploadfile', value);
	});
	ipcMain.on('showSuspensionWindow', () => {
		if (win) {
			if (win.isVisible()) {
				createSuspensionWindow();
			} else {
				win.showInactive(); //显示但不聚焦于窗口
			}
		} else {
			createSuspensionWindow();
		}

	});
	ipcMain.on('lgwin', () => {
		iswinsm = false;
		win.setSize(70, 220);
	})

	ipcMain.on('smwin', () => {
		iswinsm = true;
		win.setSize(70, 60)
	})
	ipcMain.on('PrintScr', () => {
		console.log(path.join(__static, 'PrintScr.exe'));
		const {
			execFile
		} = require('child_process');
		var screen_window = execFile(path.join(__static, 'PrintScr.exe'))
		screen_window.on('exit', function(code) {
			// 执行成功返回 1，返回 0 没有截图
			if (code){ 
				mainWindow.webContents.paste();
				let pngs=clipboard.readImage().toPNG();
				let imgData = new Buffer(pngs, 'base64')
				// console.log(pngs)
			  mainWindow.webContents.send('saveImg',imgData);
			}
		})
	})
});

/**
 * On close
 */
app.on('window-all-closed', () => {
	// 	if (process.platform !== 'darwin') {
	// 		app.quit()
	// 	}
});

/**
 * On active
 */
app.on('activate', () => {
	if (mainWindow === null) {
		createWindow()
	}
});
