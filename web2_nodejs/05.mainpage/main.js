let http = require("http");
let fs = require("fs");
let url = require("url");

let app = http.createServer(function (request, response) {
    let _url = request.url;
    let pathName = url.parse(_url, true).pathname;
    let queryData = url.parse(_url, true).query;
    let title;
    let description;
    let template;
    if (pathName === "/") {
        if (queryData.id === undefined) {
            title = "Welcome";
            description = "Hello, Node.js";
        } else {
            title = queryData.id;
            description = fs.readFileSync(`data/${queryData.id}.txt`, "utf-8");
        }
        template = `
            <!doctype html> 
            <html>
            <head>
              <title>WEB1 - ${title}</title>
              <meta charset="utf-8">
            </head>
            <body>
              <h1><a href="/">WEB</a></h1>
              <ul>
                <li><a href="/?id=HTML">HTML</a></li>
                <li><a href="/?id=CSS">CSS</a></li>
                <li><a href="/?id=JavaScript">JavaScript</a></li>
              </ul>
              <h2>${title}</h2>
              <p>${description}</p>
            </body>
            </html>
            `;
        response.writeHead(200);
        response.end(template);
    } else {
        response.writeHead(404);
        response.end("Not Found");
    }
});
app.listen(3000);
