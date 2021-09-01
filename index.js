const express = require('express');

const { generateHtml, getTitle } = require("./utils")

const app = express();

const promisesAll = async (url) => {
  return new Promise(async (resolve, reject) => {
    try {
      const title = await getTitle(url)
      if(!title){
        resolve(`<li>${url} - No response</li>`)
      }
      resolve(`<li>${url} - ${title}</li>`)
    }
    catch(error){
      reject({
        error
      })
    }
  })
}

app.get('/I/want/title', async (req, res, next) => {
  const { query: { address = [] } = {} } = req
  const websitesArray = address
  let titles = []
  let list = ""

  titles = await Promise.all(websitesArray.map(url => promisesAll(url)))
  list = titles.join("")

  if(websitesArray.length === 0){
    res.status(200).send("<h1>No urls provided</h1>")
  }
  else{
    res.status(200).send(generateHtml(list))
  }
});

app.get('*', function(req, res){
  res.status(404).send("I don't know how you get here but this place doesn't exist!")
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});