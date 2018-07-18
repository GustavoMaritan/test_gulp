const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const compression = require('compression');
const src = process.argv[2] || 'demo';

const port = process.env.PORT || 3000;

app.use(compression());
app.set(src, path.join(__dirname, src));
app.use(express.static(path.join(__dirname, src)));

app.get('/*', (req, res) => {
    res.setHeader("Content-Type", "text/html");
    fs.readFile(`./${src}/index.html`, "utf8", function (err, data) {
        if (err) throw err;
        res.write(data);
        res.status(200).end();
    });
});

app.listen(port, () => {
    console.log(`Aplicação rodando na porta: ${port}`);
});
