const http = require("http");
const fs = require("fs");
const url = require("url");

function displayHTML(title, contentsList, description, fileList) {
    let contentTitle;
    if (title === "create" || title === "update") contentTitle = "";
    else contentTitle = title;

    let actions;
    if (fileList.includes(title)) {
        actions = `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`;
    } else {
        actions = `<a href="/create">create</a>`;
    }

    return `
            <!doctype html> 
            <html>
            <head>
                <title>WEB - ${title}</title>
                <meta charset="utf-8">
            </head>
            <body>
                <h1><a href="/">WEB</a></h1>
                ${contentsList}
                ${actions}
                <h2>${contentTitle}</h2>
                <p>${description}</p>
            </body>
            </html>
            `;
}

function createContentList(fileList) {
    let contentsList = "";
    fileList.forEach((name) => {
        contentsList += `<li><a href="/?id=${name}">${name}</a></li>`;
    });
    contentsList = "<ul>" + contentsList + "</ul>";
    return contentsList;
}

function displayContent(title, description, response) {
    let fileList = fs.readdirSync("./data");
    let contentsList = createContentList(fileList);
    let template = displayHTML(title, contentsList, description, fileList);
    response.writeHead(200);
    response.end(template);
}

function getFormData(request) {
    const qs = require("querystring");
    let body = "";

    return new Promise((resolve, reject) => {
        request.on("data", (chunk) => (body += chunk));
        request.on("end", () => {
            resolve(qs.parse(body));
        });
        request.on("error", () => reject(err));
    });
}

let app = http.createServer(async function (request, response) {
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
        try {
            const post = await getFormData(request);
            title = post.title;
            description = post.description;
            fs.writeFile(`data/${title}`, description, "utf-8", (err) => {
                response.writeHead(302, {
                    Location: encodeURI(`/?id=${title}`),
                });
                response.end();
            });
        } catch (err) {
            console.error("Error parsing form data:", err);
            response.writeHead(500);
            response.end("Internal Server Error");
        }
    } else if (pathName === "/update") {
        title = "update";
        const _title = queryData.id;
        const _description = fs.readFileSync(`data/${_title}`, "utf-8");
        description = `<form action="http://localhost:3000/update_process" method="post">
                        <p><input type="hidden" name="id" value="${_title}" /></p>
                        <p><input type="text" name="title" value="${_title}" /></p>
                        <p><textarea name="description">${_description}</textarea></p>
                        <p><input type="submit" /></p>
                        </form>`;
        displayContent(title, description, response);
    } else if (pathName === "/update_process") {
        try {
            const post = await getFormData(request);
            const id = post.id;
            title = post.title;
            description = post.description;
            fs.rename(`data/${id}`, `data/${title}`, (err) => {
                fs.writeFile(`data/${title}`, description, "utf-8", (err) => {
                    response.writeHead(302, {
                        Location: encodeURI(`/?id=${title}`),
                    });
                    response.end();
                });
            });
        } catch (err) {
            console.error("Error parsing form data:", err);
            response.writeHead(500);
            response.end("Internal Server Error");
        }
    } else {
        response.writeHead(404);
        response.end("Not Found");
    }
});
app.listen(3000);
