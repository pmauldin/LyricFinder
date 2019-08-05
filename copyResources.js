const fs = require('fs-extra');
const path = require('path');

fs.copy(path.join(__dirname, 'resources/'), path.join(__dirname, 'out/lyric-finder-win32-x64/resources'));