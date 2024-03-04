const { app, BrowserWindow } = require('electron');

const createWindow = () => {
	const win = new BrowserWindow({
	  width: 800,
	  height: 600
	})
	
	win.setTitle('Ojrot Project');
	win.setMenuBarVisibility(false);
	win.loadFile('index.html')
};

app.whenReady().then(() => {
	createWindow()
});