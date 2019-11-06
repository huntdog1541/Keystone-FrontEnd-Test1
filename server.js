const bodyParser = require("body-parser");
const express = require("express");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.post('/api', (req, res) => {
    const code = req.body.code;
    console.log(`POST request: code is { ${code} }`);
    res.end(`API Success`);
});

app.listen(3000, () => {
    console.log("Started on http://localhost:3000");
});