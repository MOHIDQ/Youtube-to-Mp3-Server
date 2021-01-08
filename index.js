const YoutubeMp3Downloader = require("youtube-mp3-downloader");
const express = require("express")
const app = express()
var path = require('path');
const {fork} = require("child_process")

//Configure YoutubeMp3Downloader with your settings
let YD = new YoutubeMp3Downloader({        // FFmpeg binary location
    "outputPath": "/Users/mohidqureshi/Documents/YoutubeDownloadServer/files", // Output file location (default: the home directory)
    "youtubeVideoQuality": "highestaudio",  // Desired video quality (default: highestaudio)
    "queueParallelism": 2,                  // Download parallelism (default: 1)
    "progressTimeout": 1000,                // Interval in ms for the progress reports (default: 1000)
    "allowWebm": false                      // Enable download from WebM sources (default: false)
});

app.use(express.static('files'))

//id is the id of the youtube link
app.post("/convert/:id", (req, res) => {
	const childProcess = fork("./YDownload.js") //creating child process of yDownload.js
	childProcess.send({"link": req.params.id}) //sending the youtube link to child process
	childProcess.on("message", message => {
		res.status(message.status_code) //setting the HTTP status code
		res.send(message) //sending the object from the child process which contains status code and path to mp3 file
	})
})


 
app.listen(8080)