const http = require("http");
const fs = require("fs");
const url = require("url");
const qs = require("querystring");

function createHTML(title, contentList, description) {
    let contentTitle = title;
    if (title === "create") contentTitle = "";
    return `
            <!doctype html> 
            <html>
            <head>
                <title>WEB - ${title}</title>
                <meta charset="utf-8">
            </head>
            <body>
                <h1><a href="/">WEB</a></h1>
                ${contentList}
                <a href="/create">create</a>
                <h2>${contentTitle}</h2>
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
    } else if (pathName === "/create_process") {
        let body = "";
        request.on("data", (chunk) => (body += chunk));
        request.on("end", () => {
            const post = qs.parse(body);
            title = post.title;
            description = post.description;
            fs.writeFile(`data/${title}`, description, "utf-8", (err) => {
                response.writeHead(302, { Location: `/?id=${title}` });
                response.end();
            });
        });
    } else {
        response.writeHead(404);
        response.end("Not Found");
    }
});
app.listen(3000);
