#! /usr/bin/env node
const { processRequest } = require('./request.js')

const state = {
  postData: ''
}

process.stdin.setEncoding('utf8')

process.stdin.on('data', chunk => {
  state.postData += chunk
})

process.stdin.on('end', processRequest(state))
