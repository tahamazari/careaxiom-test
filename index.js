const express = require('express');

const { generateHtml, promisesAll } = require("./utils")

const app = express();

app.get('/I/want/title', async (req, res, next) => {
  const { query: { address = [] } = {} } = req
  const websitesArray = address
  let titles = []
  let list = ""

  if(websitesArray.length === 0 && typeof(websitesArray) !== "string"){
    res.status(200).send("<h1>No urls provided</h1>")
  }

  const inputUrls = typeof(websitesArray) === "string" ? [websitesArray] : websitesArray 

  titles = await Promise.all(inputUrls.map(url => promisesAll(url)))
  list = titles.join("")

  return res.status(200).send(generateHtml(list))
});

app.get('*', function(req, res){
  res.status(404).send("I don't know how you get here but this place doesn't exist!")
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});