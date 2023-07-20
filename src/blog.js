const fs     = require('fs')
const pug    = require('pug')
const path   = require('path')
const marked = require('marked')

const postsDir  = '../posts'
const publicDir = '../public'

const postListTemplatePath = 'index.pug'
const postTemplatePath = 'views/post.pug'
const listTemplatePath = 'views/list.pug'

const getHeading = content => {
  let ast = marked.lexer(content)
  let title = false
  let firstParagraph = false

  for (const node of ast) {
    if (node.type === 'heading' && node.depth == 1 && !title) {
      title = node.text
    }
    if (node.type === 'paragraph' && !firstParagraph) {
      firstParagraph = node.text
    }
  }
  return [title, firstParagraph]
}

const generatePostFile = (filename, posts) => {
  let mdPath = path.join(postsDir, filename)
  let mdContent = fs.readFileSync(mdPath, 'utf8')

  let [title, firstParagraph] = getHeading(mdContent)

  let postHTML = pug.renderFile(postTemplatePath, {
    "title": title,
    "content": marked.parse(mdContent)
  })

  postURL = path.join('posts', title.toLowerCase().replace(/\s+/g, '_'))

  let postFilename = path.join(publicDir, postURL)
  fs.writeFileSync(postFilename, postHTML, 'utf8')

  posts.push({
    title: title,
    preview: firstParagraph,
    url: postURL
  })
}

const generateBlog = _ => {
  let posts = []
  let files = fs.readdirSync(postsDir)

  fs.readdirSync(postsDir)
    .sort((a, b) => fs.statSync(path.join(postsDir, b)).ctime - fs.statSync(path.join(postsDir, a)).ctime)
    .forEach(filename => {
      if (filename.endsWith('.md')) {
        generatePostFile(filename, posts)
      }
    })

  let listFilename = path.join(publicDir, 'index.html')
  let listHTML = pug.renderFile(listTemplatePath, {
    posts: posts
  })

  fs.writeFileSync(listFilename, listHTML, 'utf8')

  return "done"
}

marked.use({
  mangle : false,
  headerIds : false
})

module.exports = { generateBlog }
