import {shell} from 'electron';
import * as path from "path";
import log from 'electron-log';
import fetch from 'electron-fetch';

export interface SpotifyData {
    songName: string;
    artist: string;
}

const spotifyUrl = "https://accounts.spotify.com/authorize";
const spotifyOptions = {
    response_type: "token",
    client_id: "36d2512378be4ce2a006b83a47aeb0c1",
    redirect_uri: "http://localhost:1337/spotify/callback",
    scope: "user-read-currently-playing"
};

const authorizeUrl = `${spotifyUrl}?client_id=${spotifyOptions.client_id}&redirect_uri=${spotifyOptions.redirect_uri}&scope=${spotifyOptions.scope}&response_type=${spotifyOptions.response_type}`;
let spotifyToken = null;

const getToken = () => spotifyToken;

const setToken = (token) => {
    spotifyToken = token;
};

class SpotifyService {
    setupServer(expressApp) {
        expressApp.get('/spotify/callback', (req, res) => {
            res.sendFile(path.join(`${process.cwd()}/resources/spotifyCallback.html`));
        });

        expressApp.post('/spotify/callback', (req, res) => {
            const data = req.body;

            if (data.token) {
                setToken(data.token);
            }

            res.body(data);
        });
    };

    loggedIn () {
        return getToken() !== null;
    };

    login() {
        shell.openExternal(authorizeUrl);
    };

    async getCurrentTrack() : Promise<SpotifyData> {
        log.info("FETCHING SPOTIFY");
        if (spotifyToken === null) {
            return null;
        }

        try {
            const spotifyResponse = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });

            log.info(spotifyResponse);

            const spotifyJson = await spotifyResponse.json();

            log.info(spotifyJson);

            return {
                songName: spotifyJson.item.name,
                artist: spotifyJson.item.artists[0].name
            };
        } catch (e) {
            log.error(e);
            return null;
        }
    };
}

export default new SpotifyService();