var fs = require('fs');
const express = require('express')
const app = express()
const port = 3000
var os = require( 'os' );

var networkInterfaces = os.networkInterfaces( );

try {
console.log( networkInterfaces.wlan0[0].address );
} catch(err) {
	console.log(networkInterfaces)
}

app.get('/', (req, res) => {
	let path = req.query.dir;
	if (path == undefined) {
		let dirPath = "?dir=/storage/emulated/0";
		let pageContent = "<input style='width: 200px;'  type='button' onclick='redirect(\"" + dirPath +"\")' value='Internal Storage'></input>"
		dirPath = "?dir=" + "/data/data/com.termux/files/home";
		pageContent += "<input style='width: 200px;'  type='button' onclick='redirect(\"" + dirPath +"\")' value='Termux'></input>"
		res.send(pageContent);
		return;
		let structure = getPageStructure(__dirname + "/index.html");
		structure = fillStructure(structure, "[!-DIRECTORIES-!]", () => {
			let dirs = ["/storage/emulated/0", "/data/data/com.termux/files/home"];
			let names = ["Internal Storage", "Termux"]
			let pageContent = "";
			for (let i in dirs) {
				let dirPath = "?dir=" + dirs[i];
				let struct = getPageStructure(__dirname + "/folder.html");
				struct = fillStructure(struct, "[!-URL-!]", () => {
					return dirPath;
				});
				struct = fillStructure(struct, "[!-NAME-!]", () => {
					return names[i];
				});
				pageContent += struct;
			}
			return pageContent;
		});	
	}
	if (path.indexOf("/") == -1) {
		path += "/";
	}
	console.log(path);
	try {
		let structure = getPageStructure(__dirname + "/index.html");
		structure = fillStructure(structure, "[!-CURRENTDIRECTORY-!]", (path) => {
			let backPath = path.split("\\");
			if (backPath.length == 1) {
				backPath = path.split("/");
			}
			console.log(backPath);
			let pageContent = "";
			for (let i in backPath) {
				if (backPath[i] != "") {
					console.log(i);
					let dirPath = "";
					let j = parseInt(i) + 1;
					for (let t =0; t < j; t++) {
						console.log(t + " " + j);
						dirPath += backPath[t] + "/";
					}
					console.log(dirPath);
					pageContent += "<input style='width: 200px;' type='button' onclick='redirect(\"?dir=" + dirPath +"\")' value='" + backPath[i] +"'></input>"
				}
			}
			return pageContent;
		}, path);
		
		structure = fillStructure(structure, "[!-DIRECTORIES-!]", () => {
			let dirs = getDirectories(path);
			let pageContent = "";
			for (let i in dirs) {
				let dirPath = "?dir=" + path.split("\\").join("/") + "/" + dirs[i];
				let struct = getPageStructure(__dirname + "/folder.html");
				struct = fillStructure(struct, "[!-URL-!]", () => {
					return dirPath;
				});
				struct = fillStructure(struct, "[!-NAME-!]", () => {
					return dirs[i];
				});
				pageContent += struct;
			}
			return pageContent;
		});	
		console.log(structure);
		structure = fillStructure(structure, "[!-FILES-!]", () => {
			let files = getFiles(path);
			let pageContent = "";
			for (let i in files) {
				let filePath = "?dir=" + path.split("\\").join("/") + "/" + files[i];
				let struct = getPageStructure(__dirname + "/file.html");
				struct = fillStructure(struct, "[!-URL-!]", () => {
					return filePath;
				});
				struct = fillStructure(struct, "[!-IMAGE-!]", () => {
					let fileExt = files[i].split(".")[1].toLowerCase();
					if (fileExt == "jpg" || fileExt == "png") {
						return filePath;
					}
					return "https://lh3.googleusercontent.com/proxy/OtOWz00s5JMjXj9GqtGz2gUKcULSOW5MY7AeJnHk-BfY6AyNceMtgkCDENs4L61FhWAQPcRCyiR9RR3z_jCadDq4F9SAbgK-78umSdgmVoHgRPKkdyA3DQ";
				});
				struct = fillStructure(struct, "[!-NAME-!]", () => {
					return files[i];
				});
				pageContent += struct;
			}
			return pageContent;
		});	
		res.send(structure);
	} catch(err) {
		res.sendFile(path);
	}
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))


function getHeaderScripts() {
	let header = "<script>function redirect(url) {window.location.href = url}</script>";
	return header;
}

function getPageStructure(file) {
	let content = fs.readFileSync(file, "utf8");
	return content;
}

function fillStructure(structure, replace, fillScript, passToFunc) {
	let content = "";
	let structArray = structure.split("");
	for (let i in structArray) {
		if (i == structure.indexOf(replace)) {
			
			content += fillScript(passToFunc);
		}
		content += structArray[i];
	}
	return content.replace(replace, "");
}

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