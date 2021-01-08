const YoutubeMp3Downloader = require("youtube-mp3-downloader");
//Configure YoutubeMp3Downloader with your settings
let YD = new YoutubeMp3Downloader({        // FFmpeg binary location
    "outputPath": "/Users/mohidqureshi/Documents/YoutubeDownloadServer/files", // Output file location (default: the home directory)
    "youtubeVideoQuality": "highestaudio",  // Desired video quality (default: highestaudio)
    "queueParallelism": 2,                  // Download parallelism (default: 1)
    "progressTimeout": 1000,                // Interval in ms for the progress reports (default: 1000)
    "allowWebm": false                      // Enable download from WebM sources (default: false)
});

process.on("message", message => {

	console.log(message.link)
	YD.download(message.link);
 
	//download is finished to send the result back
	YD.on("finished", (err, data) => {
	    console.log(JSON.stringify(data, null, 2));
	    let path = data.videoTitle
	    let urlPath = "http://localhost:8080/" + path.replace(/ /g, "%20") + ".mp3" //creating url for the nwe mp3 file
	    process.send({"url": urlPath, "status_code": 200}) //sending object with url and status code to parent process
		process.exit() //exit/kill child process to preserve memory
	});
	 
	YD.on("error", function(error) {
	    //return {"error": "Url incorrect"}
	    process.send({"error": "Url incorrect", "status_code": 404})
		process.exit()
	});
	 
	YD.on("progress", function(progress) {
	    console.log(JSON.stringify(progress, null, 2));
	});

})