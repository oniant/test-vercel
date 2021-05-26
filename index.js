var express = require("express");
var app = express();

app.get('/', function(request, writer) {
    writer.send("Hello World");
});

app.get('/type', function(request, writer) {
    var type_and_subgroup_url = "https://share.dmhy.org/topics/advanced-search?team_id=0&sort_id=0&orderby="
    const https = require("https");
    const cheerio = require("cheerio");
    https.get(type_and_subgroup_url, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
            var types = [];
            var teams = [];
            const $ = cheerio.load(data);
            $("#AdvSearchTeam option").each(function(){
                types.push({"Id": Number($(this).val()), "Name": $(this).text()});
            });
            $("#AdvSearchSort option").each(function(){
                teams.push({"Id": Number($(this).val()), "Name": $(this).text()});
            });
            writer.send(types);
        });
    }).on("error", (err) => {
        writer.send("Error: "+err.message);
    });
});

var server = app.listen(20001, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log("service up at http://%s:%s", host, port);
})
