require("dotenv").config();
var keys = require("./keys.js");

var Spotify = require("node-spotify-api")

var spotify = new Spotify(keys.spotify);

var fs = require("fs");

var axios = require("axios");

var moment = require("moment");

var request = require("request");

var command = process.argv[2];
var search = process.argv.slice(3).join(" ");

startApp(command, search)

function startApp(command, search) {
    if (command === "concert-this") {
        concert(search)
    } else if (command === "spotify-this-song") {
        searchSong(search)
    }
    else if (command === "movie-this") {
        movie(search)
    }
    else if (command === "do-what-it-says") {
        doWhatItSays()
    }
    else {
        console.log("please enter a valid command")
    }
}

function concert(artist) {
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp").then(
        function (data) {

            var data = data.data

            if (data.length === 0) {
                console.log("Artist is currently not touring")
            }



            for (let index = 0; index < data.length; index++) {
                const allShows = data[index];
                // console.log(allShows.venue.name)
                console.log("Venue: " + allShows.venue.name);
                console.log("Location: " + allShows.venue.city + "," + allShows.venue.country);
                console.log("Date: " + moment(allShows.datetime).format("MM/DD/YYYY"));
                console.log("\n--------------\n");

            }
        })
}

function allArtists(artists) {
    return artists.name
}
function searchSong(song) {
    console.log("inside of searchSong function")
    if (song === "") {
        song = "The Sign"
    };
    spotify.search({
        type: 'track', query: song
    },
        function (error, data) {
            if (error) {
                console.log(error);
                return;
            }
            //           console.log(data);

            var songs = data.tracks.items
            for (let i = 0; i < songs.length; i++) {

                console.log("Artist: " + songs[i].artists.map(allArtists));
                console.log("Song: " + songs[i].name);
                console.log("Preview song: " + songs[i].preview_url);
                console.log("Album " + songs[i].album.name);
                console.log("\n--------------\n");
            }

        })
}

function movie(movieName) {
    if (movieName === "") {
        movieName = "Mr. Nobody";
    };

    axios.get("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=trilogy").then(
        function (response) {
            var movies = response.data;
            //console.log(data);
            console.log("Title: " + response.data.Title);
            console.log("Year Released: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.Ratings[0].Value);
            console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
            console.log("Country Produced:" + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
            console.log("\n--------------\n");


        }
    )
}

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        console.log(data);
        var splitData = data.split(",");
        console.log(splitData);
        startApp(splitData[0], splitData[1])
        {

        }


    }
    )
}
