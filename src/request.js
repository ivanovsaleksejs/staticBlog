const fs = require('fs')

const { processRoute } = require('./routes.js')

const processQuery = query => query.split("&").map(s => (p = s.split('='), ({[p[0]] : p[1]})))

const processRequest = state => _ => {
  let name  = process.env.SCRIPT_NAME
  let query = process.env.QUERY_STRING
  let body  = state.postData
  let remoteKey = process.env.HTTP_X_API_KEY || false
  let authKey   = fs.readFileSync('keys/auth.key', 'utf8').trim()

  let response = 'Forbidden'
  if (authKey && remoteKey === authKey) {
    response = processRoute(name, processQuery(query), body, authKey)
  }

  console.log('Content-Type: text/plain')
  console.log()
  console.log(response)
}

module.exports = { processRequest }
