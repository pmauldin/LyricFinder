import express from 'express';

const expressApp = express();
expressApp.use(express.json());

let server = null;

class ServerService {
    getApp() {
        return expressApp;
    };

    startServer() {
        if (server !== null) return;

        server = expressApp.listen(1337);
    };

    stopServer() {
        if (server == null) return;

        server.close();
        server = null;
    };
}

export default new ServerService();
