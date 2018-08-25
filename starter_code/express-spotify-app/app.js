const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const path = require('path');
const hbs = require('hbs');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views/layouts');
app.use(express.static(path.join(__dirname, '/public')));

// Remember to paste here your credentials
const clientId = '774e8e6824984d9f8b2f4b72bb6094e5', // TO CHANGE
    clientSecret = '19ad7b9b5d1a4f26a13d180d003d5b0a'; // TO CHANGE

const spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
    function(data) {
        spotifyApi.setAccessToken(data.body['access_token']);
    },
    function(err) {
        console.log('Something went wrong when retrieving an access token', err);
    }
);

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/artist', (req, res) => {
    const { artist } = req.query;
    console.log(artist);

    spotifyApi
        .searchArtists(artist)
        .then(data => {
            res.render('artist', { data: data.body.artists.items });
            console.log(data.body.artists.items);
        })
        .catch(err => {
            console.log(err);
        });
});

app.get('/albums/:artistId', (req, res) => {
    const artistId = req.params.artistId;

    spotifyApi.getArtistAlbums(artistId).then(
        data => {
            res.render('albums', { data: data.body.items });
        },
        function(err) {
            console.log(err);
        }
    );
});

app.get('/tracks/:trackId', (req, res) => {
    const trackId = req.params.trackId;

    spotifyApi.getAlbumTracks(trackId).then(
        data => {
            console.log(data.body.items);
            res.render('tracks', { data: data.body.items });
        },
        function(err) {
            console.log('Something went wrong!', err);
        }
    );
});

app.listen(4000);
