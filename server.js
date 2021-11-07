function requireHTTPS(req, res, next) {
  // The 'x-forwarded-proto' check is for Heroku
  if (!req.secure && req.get("x-forwarded-proto") !== "https") {
    return res.redirect("https://" + req.get("host") + req.url);
  }
  next();
}

// app.use(requireHTTPS);
const express = require('express');

const app = express();

app.use(requireHTTPS);
app.use(express.static(__dirname + '/dist/quandl-viewer'));
app.get('/*', (req,res,next) => {
    res.sendFile(path.join(__dirname + '/dist/quandl-viewer/index.html'));
});

app.listen(process.env.PORT || 3001);
