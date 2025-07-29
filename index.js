require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');
const { URL } = require("url");
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const urlSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  short_url: {
    type: Number,
    required: true
  }
});

const Url = mongoose.model('Url', urlSchema);

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use('/public', express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', (req, res) => {
  res.json({ greeting: 'hello API' });
});

app.post("/api/shorturl", async (req, res) => {
  try {
    const is_valid = await isValid(req.body.url);
    if (!is_valid) throw new Error("Invalid URL");

    const result = await addUrl(req.body.url);
    res.send({original_url: result.url, short_url: result.short_url});

  } catch (err) {
    res.send({error: err.message});
  }
}).get("/api/shorturl/:short_url", async (req, res) => {
  const matchingEntry = await searchShortUrl(req.params.short_url);
  if (matchingEntry) {
    res.redirect(matchingEntry.url);
  } else {
    res.send({error: "No short URL found for the given input"});
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

async function addUrl(url) {
  const matchingEntry = await searchUrl(url);
  if (matchingEntry) {
    return matchingEntry;

  } else {
    const short_url = await getShortUrl(url);
    const urlObject = new Url({
      url,
      short_url
    });
    return urlObject.save();
  }
}

function isValid(url) {
  const hostname = new URL(url).hostname;
  return new Promise((resolve) => {
    dns.lookup(hostname, (err) => {
      if (err) resolve(false);
      resolve(true);
    });
  });
}

async function getShortUrl(url) {
  const lastEntry = await Url.findOne().sort({short_url: -1});
  const shortUrl = lastEntry ? lastEntry.short_url + 1 : 1;
  return Promise.resolve(shortUrl);
}

function searchUrl(url) {
  return Url.findOne({url});
}

function searchShortUrl(short_url) {
  return Url.findOne({short_url});
}