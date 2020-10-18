const express = require('express');
const formidable = require('formidable');
const fs = require('fs');
const lgbk = require('./logbook_translator');


const app = express();
const port = 8080;

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

app.get("/", (req, res) => {
	res.render("index");
});

app.post("/uploaded", (req,res) => {
	form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files) {
		var oldpath = files.uploadFile.path;
		var newpath = __dirname + '/uploads/' + files.uploadFile.name;
		fs.copyFile(oldpath, newpath, function (err) {
			if (err) throw err;
			
			records = lgbk.rcoaXlsxToStandard(newpath);

			var fs = require("fs");
			fs.writeFile("first_logbook.json", JSON.stringify(records), 'utf8', function(e){});

			res.render("uploaded", {"file": {"name": files.uploadFile.name, "recordCount": records.length}});
		});
	});
});

app.listen(port, () => {
	console.log(`Example App Listening At http://localhost:${port}`);
});