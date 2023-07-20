const { generateBlog } = require('./blog.js')

const routes = {
  "api" : {
    "generate" : {
      "method" : "GET",
      "action" : generateBlog
    },
    "404" : {
      "method" : "GET",
      "action" : (_ => "")
    }
  }
}

const processRoute = (name, query, body) => {
  let route = name.slice(1).split("/")
  if (routes[route[0]] && (action = routes[route[0]][route[1]])) {
    return action.action(query, body)
  }
  else if (routes[route[0]]) {
    return routes[route[0]]["404"].action()
  }
}

module.exports = { processRoute }
