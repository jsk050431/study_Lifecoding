let http = require("http");
let fs = require("fs");
let url = require("url");

function createHTML(title, contentList, description) {
    if (title === "create") title = "";
    return `
            <!doctype html> 
            <html>
            <head>
                <title>WEB1 - ${title}</title>
                <meta charset="utf-8">
            </head>
            <body>
                <h1><a href="/">WEB</a></h1>
                ${contentList}
                <a href="/create">create</a>
                <h2>${title}</h2>
                <p>${description}</p>
            </body>
            </html>
            `;
}

function createContentList(fileList) {
    let contentList = "";
    fileList.forEach((name) => {
        contentList += `<li><a href="/?id=${name}">${name}</a></li>`;
    });
    contentList = "<ul>" + contentList + "</ul>";
    return contentList;
}

function displayContent(title, description, response) {
    let fileList = fs.readdirSync("./data");
    let contentList = createContentList(fileList);
    let template = createHTML(title, contentList, description);
    response.writeHead(200);
    response.end(template);
}

let app = http.createServer(function (request, response) {
    let _url = request.url;
    let pathName = url.parse(_url, true).pathname;
    let queryData = url.parse(_url, true).query;
    let title;
    let description;
    if (pathName === "/") {
        if (queryData.id === undefined) {
            title = "Welcome";
            description = "Hello, Node.js";
        } else {
            title = queryData.id;
            description = fs.readFileSync(`data/${title}`, "utf-8");
        }
        displayContent(title, description, response);
    } else if (pathName === "/create") {
        title = "create";
        description = `<form action="http://localhost:3000/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"/></p>
        <p><textarea name="description", placeholder="description"></textarea></p>
        <p><input type="submit" /></p>
        </form>`;
        displayContent(title, description, response);
    } else {
        response.writeHead(404);
        response.end("Not Found");
    }
});
app.listen(3000);
