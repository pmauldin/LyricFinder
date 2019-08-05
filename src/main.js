const {app, shell, Menu, Tray} = require('electron');

import ServerService from './services/serverService';
import SpotifyService from './services/spotifyService';
import GeniusService from './services/geniusService';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit();
}

let tray = null;

SpotifyService.setupServer(ServerService.getApp());
// GeniusService.setupServer(ServerService.getApp());
ServerService.startServer();

const startApp = () => {

    tray = new Tray('resources/TrayIcon.ico');

    const contextMenu = Menu.buildFromTemplate([
        { label: 'Exit', type: 'normal', role: 'quit' }
    ]);

    tray.setToolTip('Click to login');
    tray.setContextMenu(contextMenu);

    tray.on('click', () => {
        if (!SpotifyService.loggedIn()) {
            SpotifyService.login();
        } else {
            ServerService.stopServer();
            tray.setToolTip('Click to open lyrics');
            (async () => {
                const spotifyData = await SpotifyService.getCurrentTrack();
                const lyricUrl = await GeniusService.getLyricUrl(spotifyData);
                shell.openExternal(lyricUrl);
            })();
        }
    })
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', startApp);

app.on('quit', () => {
    ServerService.stopServer();
});
