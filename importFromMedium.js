var mysql = require('mysql2');
var fs = require('fs');
const cheerio = require('cheerio');
var secretConfig = require('./secret-config.json');

console.log("Starting import...");

function connectDB() {
  var con = mysql.createConnection({
      host: secretConfig.DB_HOST,
      user: secretConfig.DB_USER,
      password: secretConfig.DB_PASSWORD,
      database: secretConfig.DB_NAME
  });
  con.connect(function(err) {
      if (err) {
          console.log("MySQL is not connected.");
          throw err;
      }
      console.log("Connected to MySQL!");
  });
  return con;
}

function closeConnection(con) {
	con.end(function(err) {
		if (err) {
			console.log("MySQL is not connected.");
			throw err;
		}
		console.log("MySQL connection closed.");
	});
}

const arrayOfFiles = fs.readdirSync("./medium/posts");

var con = connectDB();

console.log("Importing " + arrayOfFiles.length + " articles...");
var count = 0;

for (var i in arrayOfFiles) {
  var file = arrayOfFiles[i];
	if (!file.startsWith('draft')) {
		var fileContent = fs.readFileSync("./medium/posts/" + file, "utf8");
		const $ = cheerio.load(fileContent);
		$(".graf--title").remove();
		$("hr").remove();
		var title = $("h1.p-name").text();
		var slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
		var content = $("section.e-content").html();

		var sql = "INSERT INTO posts (title, slug, content) VALUES (?, ?, ?);";
		con.query(sql, [title, slug, content], function (err, result) {
			if (err) throw err;
			console.log("+1 article inserted.");
			count++;
			if (count >= arrayOfFiles.length) {
				closeConnection(con);
				console.log("Imported " + count + " articles.");
				console.log("Finished importing.");
			}
		});
	}
	else {
		count++;
		if (count >= arrayOfFiles.length) {
			closeConnection(con);
			console.log("Imported " + count + " articles.");
			console.log("Finished importing.");
		}
	}
}