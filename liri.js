<<<<<<< Updated upstream
console.log("LIRI node-bot is ready to rumble");


var request = require('request');
var fs = require('fs');
var spotify = require('spotify');
var Twitter = require('twitter');
var keys = require('./keys.js');
var twit = new Twitter(keys);
var argument = process.argv[2];
var value = process.argv[3];
var dataText = process.argv[4];

var params = {
  "screen_name": "nivvoudit",
  "count": 20
}

if(argument === "my-tweets"){
  twit.get('statuses/user_timeline', params, gotData);
  function gotData(error, data, response){
    var tweets = data; //data is the object
    for(var i = 0; i < tweets.length; i++){
      console.log(tweets[i].text);
      console.log(tweets[i].created_at);
    }
  };
  outputText();
}

if(argument === "movie-this"){
    console.log(process.argv);
    var movieTitle = process.argv[3];
    request("http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&r=json&tomatoes=true",function (error, response, body){

        if(process.argv[3]){
        console.log(body);

        }else{
            request("http://www.omdbapi.com/?t=mr+nobody+&y=&plot=short&r=json&tomatoes=true",function(error, response,body){
                console.log(body);

            })
        }
    })
    // outputText();
}
// Spotify Logic
if(argument === "spotify-this-song"){
    var songTitle = process.argv[3];
    spotify.search({ type: 'track', query: songTitle }, function(err, data){

        if(process.argv[3]){
            var data = data.tracks.items;
            for(var i =0; i < data.length; i++){

                console.log(data[i].name); //song track name
                console.log(data[i].album.href); //url
                console.log(data[i].album.name); //album name
                console.log(data[i].preview_url); //preview link to the song

                for(var j =0; j < data[i].artists.length; j++){
                    console.log(data[i].artists[j].name); //artist's name
                }
            }
        }else{
            spotify.search({ type: 'track', query: "I want it that way"}, function(err, data){
                var data = data.tracks.items;
                console.log(data[0].name); //song track name
                console.log(data[0].album.href); //url
                console.log(data[0].album.name); //album name
                console.log(data[0].preview_url); //preview link to the song
                console.log(data[0].artists[0].name); //artist's name
            });
        }
    });
    outputText();
}
//Read Text File Logic
if(argument === "do-what-it-says"){
    fs.readFile('random.txt', "utf8", function(err, data){
        console.log(data);
    });
    outputText();
}
function outputText(){
    fs.appendFile('log.txt', 'Argument: ' + argument + '. Movie or Song Title: ' + value + '. Movie or Song info: ' + dataText + '.');
=======
'use strict';

var Twitter = require('twitter');
var spotify = require('spotify')
var SpotifyWebApi = require('spotify-web-api-node');
var request = require("request");
var inquirer = require('inquirer');
var twitterKeyFile = require("./keys.js");
var spotifyApi = new SpotifyWebApi();
var fs = require("fs");

var client = new Twitter({
    consumer_key: twitterKeyFile.twitterKeys.consumer_key,
    consumer_secret: twitterKeyFile.twitterKeys.consumer_secret,
    access_token_key: twitterKeyFile.twitterKeys.access_token_key,
    access_token_secret: twitterKeyFile.twitterKeys.access_token_secret
});

var whatToDo = [
{
    type: "list",
    message: "pick one",
    name: "thisIsWhatToDo",
    choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"]
}];

inquirer.prompt(whatToDo).then(function(whatTheyWannaDo) {
    switchAction(whatTheyWannaDo.thisIsWhatToDo)
});

function switchAction(decision) {
    var title = "";
    if (decision === "do-what-it-says") {
        recordIt("doing what it says");
        fs.readFile("random.txt", "utf8", function (error, data) {
            var dataArr = data.split(",");
            decision = dataArr[0];
            title = dataArr[1];

            callbackGuts(title);
        });
    }
    else {
        title = getTitle(callbackGuts);
    }
    function callbackGuts(input){
        if (typeof input === "string"){
            title = input;
        }
        else {
            title = input.title001;
        }
        switch (decision) {
            case "my-tweets" :
                if (title === ""){
                    title = "nivvoudit";
                }
                getTheTweets(title);
            break;

            case "spotify-this-song" :
                if (title === ""){
                    title = "the sign ace of base";
                }
                getTheSongInfo(title);
            break;

            case "movie-this" :
                if (title === ""){
                    title = "mr nobody";
                }
                getTheMovieInfo(title);
            break;
        }
    }

}

var getTheTitle = [
    {
		type: "input",
		message: "For what account/song/movie?",
		name: "title001"
    }];

function getTitle(callbackGuts) {
    inquirer.prompt(getTheTitle).then(callbackGuts)
}

function getTheTweets(account) {
    var params = {screen_name: account};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        var i=0;
        if (!error) {
            recordIt("\n----------------------------");
            recordIt("\nThe last 5 tweets for @" + account + " are: \n");
            do{
                recordIt(i+1 + ". " + tweets[i].text);
                recordIt("\ntweeted on " + tweets[i].created_at);
                i++;

                recordIt("\n");
            } while (i<5);
        }
    });
}

function getTheSongInfo(song) {
    spotifyApi.searchTracks(song).then(function (data) {
        var checking = data.body.tracks.items[0].album.artists[0].name;
            recordIt("\n----------------------------");
            recordIt("\nThis is the artist: ");
            recordIt(data.body.tracks.items[0].album.artists[0].name);
            recordIt("\nThis is the song's name: ");
            recordIt(data.body.tracks.items[0].name);
            recordIt("\nThis is preview link of the song from Spotify: ");
            recordIt(data.body.tracks.items[0].preview_url);
            recordIt("\nThis is album that the song is from: ");
            recordIt(data.body.tracks.items[0].album.name);
        }).catch(function(err) {
        recordIt('\nUnfortunately, something has gone wrong.', err.message);
    });
}

function getTheMovieInfo(movie) {

    var url = "http://www.omdbapi.com/?t=" + movie;
    request(url, function(error, response, body) {

    if (!error && response.statusCode === 200) {
        recordIt("\n----------------------------");
        recordIt("\nThe movie's title is " + JSON.parse(body).Title);
        recordIt("\nThe movie came out in " + JSON.parse(body).Year);
        recordIt("\nThe movie's IMDB rating is " + JSON.parse(body).imdbRating);
        recordIt("\nThe movie's was made in " + JSON.parse(body).Country);
        recordIt("\nThe movie was filmed in " + JSON.parse(body).Language);
        recordIt("\nThe plot is: " + JSON.parse(body).Plot);
        recordIt("\nThe stars of the movie are " + JSON.parse(body).Actors);
        recordIt("\nFind out more on the website: " + JSON.parse(body).Website);
  }
});
}

function recordIt(stuffToWrite) {
    console.log(stuffToWrite);
    fs.appendFile("log.txt", stuffToWrite, function (err) {
        if (err) {
            return console.log("Something went wrong writing to log.txt: " + err);
        }
    });
>>>>>>> Stashed changes
}
