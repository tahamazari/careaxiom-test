const axios = require('axios');

const parseTitle = (body) => {
  let match = body.match(/<title>([^<]*)<\/title>/)
  if (!match || typeof match[1] !== 'string')
    throw new Error('Unable to parse the title tag')
  return match[1]
}

const addhttp = (url) => {
  if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
      url = "https://" + url;
  }
  return url;
}

const validURL = (str) => {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}

const getTitle = async (url) => {
  return new Promise(async (resolve, reject) => {
    if(!validURL(url)){
      resolve(false)
    }
    try{
      const resp = await axios.get(addhttp(url));
      const title = parseTitle(resp.data)
      resolve(title)
    }
    catch(error){
      reject({
        success: false,
        error
      })
    }
  })
}

const generateHtml = (list) => {
  return(
    `
      <html>
        <head></head>
        <body>
          <h1> Following are the titles of given websites: </h1>
          <ul>${list}</ul>
        </body>
      </html>
    `
  )
}

module.exports = {
  getTitle,
  generateHtml,
  parseTitle
}