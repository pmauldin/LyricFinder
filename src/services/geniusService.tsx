import {SpotifyData} from "./spotifyService";
import fetch from 'electron-fetch';

let geniusToken = null;
// TODO Remove hack
geniusToken = "OUPYwDk8y6w4aRLdkRNaqNuzt7Lhy-gbL3WTWpqHdKd4oZM3otJxJh_79YN0CHgc";

const getToken = () => geniusToken;

const setToken = (token) => {
    geniusToken = token;
};

class GeniusService {
    async getLyricUrl(spotifyData : SpotifyData) : Promise<string> {
        if (geniusToken === null) {
            return null;
        }

        try {
            const geniusResponse = await fetch(`http://api.genius.com/search?q=${spotifyData.songName} ${spotifyData.artist}&access_token=${getToken()}`);

            const geniusJson = await geniusResponse.json();
            if (geniusJson.response.hits.length === 0) return null;

            return geniusJson.response.hits[0].result.url;
        } catch (e) {
            return null;
        }
    };
}

export default new GeniusService();