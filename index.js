const express = require('express');
const async = require("async");

const { generateHtml, getTitle } = require("./utils")

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

  async.map(inputUrls, async (url) => {
    let { title, success } = await getTitle(url)
    if(!success){
      titles.push(`<li>${url} - No response</li>`)
    }
    else{
      titles.push(`<li>${url} - ${title}</li>`)
    }
  }, () => {
    list = titles.join("")
    console.log(titles)
    return res.status(200).send(generateHtml(list))
  })
});

app.get('*', function(req, res){
  res.status(404).send("<h1>I don't know how you get here but this place doesn't exist!</h1>")
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});