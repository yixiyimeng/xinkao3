import {
	app,
	BrowserWindow,
	screen,
	ipcMain
} from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
	global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow, win
let iswinsm = true
const winURL = process.env.NODE_ENV === 'development' ?
	`http://localhost:9080/mainPage` :
	`file://${__dirname}/mainPage/index.html`
const subwinURL = process.env.NODE_ENV === 'development' ? 'http://localhost:9080/newPage' :
	`file://${__dirname}/newPage/index.html`;

function createWindow() {
	/**
	 * Initial window options
	 */
	mainWindow = new BrowserWindow({
		height: 600,
		useContentSize: true,
		width: 920,
		titleBarStyle: 'hidden-inset',
 		//frame: false,
// 		transparent: true,
		show: true,
		fullscreenable: true,
 		//fullscreen: true,
		simpleFullscreen: true,
		resizable: true,
		hasShadow: false,
		webPreferences: {
			webSecurity: false,
			devTools: true //关闭调试工具
		}
	})

	mainWindow.loadURL(winURL)
	//mainWindow.setFullScreen(true); //设置全屏
	mainWindow.on('closed', () => {
		mainWindow = null
	})
	/* 窗口关闭时候，提示确认 */
	mainWindow.on('close', (e) => {
		e.preventDefault();
		if (mainWindow.isMinimized()) {
			mainWindow.show();
			//mainWindow.setFullScreen(true);
		}
		mainWindow.webContents.send('isexitApp');
	});
	/* 窗口退出最小化的时候，通知页面， */
	mainWindow.on('minimize', (e) => {
		mainWindow.webContents.send('isminimizeApp', true);
		win.webContents.send('isminimizeAppsub', true);

	});
	/* 在窗口从最小化恢复的时候触发,通知页面 */
	mainWindow.on('restore', (e) => {
		//mainWindow.setFullScreen(true);
		mainWindow.webContents.send('isminimizeApp', false);
		win.webContents.send('isminimizeAppsub', false);

	});
	/* 创建悬浮窗 */
	createSuspensionWindow()
}

/**
 * 创建悬浮窗
 */
function createSuspensionWindow() {
	win = new BrowserWindow({
		width: 70, //悬浮窗口的宽度 比实际DIV的宽度要多2px 因为有1px的边框
		height: 60, //悬浮窗口的高度 比实际DIV的高度要多2px 因为有1px的边框
		type: 'toolbar', //创建的窗口类型为工具栏窗口
		frame: false, //要创建无边框窗口
		resizable: true, //禁止窗口大小缩放
		show: false, //先不让窗口显示
		webPreferences: {
			devTools: false //关闭调试工具
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
	win.setPosition(size.width - winSize[0], 40);
	win.loadURL(subwinURL);

	win.once('ready-to-show', () => {
		win.show()
	});

	win.on('close', () => {
		win = null;
	});
	/* 悬浮窗窗口大小改变后，通知页面，显示按钮 */
	win.on('resize', (e) => {
		win.webContents.send('isresize', iswinsm);
	});
	/* 禁止掉手动拖动改变窗体大小 */
	win.on('will-resize', (e) => {
		e.preventDefault();
	});


}
app.on('ready', () => {
	/* 创建窗口 */
	createWindow();
	
	/* 监听最小化 */
	ipcMain.on('minApp', e => mainWindow.minimize());
	
	/* 监听最大化 */
	ipcMain.on('maxApp', e => mainWindow.show());
	
	/* 是否退出软件 */
	ipcMain.on('isexitApp', e => {
		mainWindow.webContents.send('isexitApp');
		if (mainWindow.isMinimized()) {
			mainWindow.show();
			//mainWindow.setFullScreen(true);
		}
	});
	/* 确定退出软件 */
	ipcMain.on("exitApp", () => {
		if (process.platform !== 'darwin') {
			//app.exit();
			app.exit();
		}
	});
	/* 悬浮窗是否 鼠标滑过 */
	ipcMain.on('lgwin', () => {
		iswinsm = false;
		win.setSize(70, 220);

	})
	/* 悬浮窗是否 鼠标滑出 */
	ipcMain.on('smwin', () => {
		iswinsm = true;
		win.setSize(70, 60)
	})
})

app.on('window-all-closed', () => {
	  if (process.platform !== 'darwin') {
	    app.quit()
	  }
})

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow()
	}
})
