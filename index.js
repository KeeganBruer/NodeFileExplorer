var fs = require('fs');
const express = require('express')
const app = express()
const port = 3000
 
if (process.argv.length <= 2) {
    console.log("Usage: " + __filename + " path/to/directory");
    process.exit(-1);
}

app.get('/', (req, res) => {
	let path = req.query.dir;
	if (path == undefined) {
		path = "/storage/emulated/0";
	}
	if (path.indexOf("/") == -1) {
		path += "/";
	}
	console.log(path);
	let pageContent = "<script>function redirect(url) {window.location.href = url}</script>";
	pageContent += "<div style='display: flex; flex-direction: column; height: 100%; width: 100%;'>"
	let backPath = path.split("\\").slice(0, path.split("\\").length-1).join("/");
	if (backPath == "") {
		backPath = path.split("/").slice(0, path.split("/").length-1).join("/");
	}
	let dirPath = "?dir=" + backPath;
	pageContent += "<input style='width: 200px;' type='button' onclick='redirect(\"" + dirPath +"\")' value='../'></input>"
	
	let dirs = getDirectories(path);
	for (let i in dirs) {
		let dirPath = "?dir=" + path.split("\\").join("/") + "/" + dirs[i];
		pageContent += "<input style='width: 200px;'  type='button' onclick='redirect(\"" + dirPath +"\")' value='" + dirs[i] +"'></input>"
	}
	let files = getFiles(path);
	for (let i in files) {
		let filePath = "localhost:3000/?dir=" + path.split("\\").join("/") + "\\" + files[i];
		pageContent += "<input style='width: 200px;' type='button' onclick='redirect(\"" + filePath +"\")' value='" + files[i] +"'></input>"
	}
	pageContent += "</div>";
	res.send(pageContent)
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))


function getDirectories(path) { 
	let directories = [];
	let items = fs.readdirSync(path);
	for (let i in items) {
		if (items[i].indexOf(".") == -1) {
			directories.push(items[i]);
		}
	}
	return directories;
}

function getFiles(path) { 
	let directories = [];
	let items = fs.readdirSync(path);
	for (let i in items) {
		if (items[i].indexOf(".") != -1) {
			directories.push(items[i]);
		}
	}
	return directories;
}