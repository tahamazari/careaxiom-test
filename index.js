const express = require('express');

const { generateHtml, generateResponse, getTitle } = require("./utils")

const app = express();

app.get('/I/want/title', async (req, res, next) => {
  const { query: { address = [] } = {} } = req
  const websitesArray = address
  let titles = []
  let list = ""

  if(websitesArray.length === 0){
    return res.status(200).send("<h1>No urls provided</h1>")
  }

  if(typeof(websitesArray) === "string"){
    generateResponse(websitesArray)
    .then(resp => {
      titles.push(resp)
      list = titles.join("")
      return res.status(200).send(generateHtml(list))
    })
  }
  else {
    for(let i = 0; i < websitesArray.length; i++){
      if(i === websitesArray.length - 1){
        generateResponse(websitesArray[i])
        .then(resp => {
          titles.push(resp)
          list = titles.join("")
          return res.status(200).send(generateHtml(list))
        })
      }
      else{
        generateResponse(websitesArray[i])
        .then(resp => {
          titles.push(resp)
        })
      }
    }
  }
});

app.get('*', function(req, res){
  res.status(404).send("I don't know how you get here but this place doesn't exist!")
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});