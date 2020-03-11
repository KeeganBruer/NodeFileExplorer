var fs = require('fs');
const express = require('express')
const app = express()
const port = 3000
var os = require( 'os' );

var networkInterfaces = os.networkInterfaces( );

console.log( networkInterfaces );

app.get('/', (req, res) => {
	let pageContent = "<script>function redirect(url) {window.location.href = url}</script>";
	pageContent += "<div style='display: flex; flex-direction: column; height: 100%; width: 100%;'>"
	let path = req.query.dir;
	if (path == undefined) {
		let dirPath = "?dir=/storage/emulated/0";
		pageContent += "<input style='width: 200px;'  type='button' onclick='redirect(\"" + dirPath +"\")' value='Internal Storage'></input>"
		dirPath = "?dir=" + "/data/data/com.termux/files/home";
		pageContent += "<input style='width: 200px;'  type='button' onclick='redirect(\"" + dirPath +"\")' value='Termux'></input>"
		res.send(pageContent);
		return;
	}
	if (path.indexOf("/") == -1) {
		path += "/";
	}
	console.log(path);
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