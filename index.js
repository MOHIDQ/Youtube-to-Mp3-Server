const YoutubeMp3Downloader = require("youtube-mp3-downloader");
const express = require("express")
const app = express()
var path = require('path');
const cors = require('cors')
const {fork} = require("child_process")

app.use(cors())
app.use(express.static('files')) //serve mp3 files

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