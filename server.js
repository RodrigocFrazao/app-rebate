const express = require('express');
const app = express();

app.use(express.static('./dist/rastrecall'));

app.get('/*', function(req, res) {
    res.sendFile('index.html', {root: './dist/rastrecall'});
});

app.listen(process.env.PORT || 8081);