import { serverQueryContent } from '#content/server'
import RSS from 'rss'

export default defineEventHandler(async (event) => {
  const feed = new RSS({
    title: 'My Nuxt 3 RSS Feed',
    description: 'This is my Nuxt 3 RSS feed',
    feed_url: 'http://meryem.com/rss.xml',
    site_url: 'http://meryem.com',
    language: 'en',
  })

  const articles = await serverQueryContent(event).find()
  
  articles.forEach(article => {
    feed.item({
      title: article.title,
      description: article.description,
      url: `http://meryem.com/${article.path}`,
      date: article.createdAt,
    })
  })

  event.node.res.setHeader('Content-Type', 'application/xml')
  event.node.res.end(feed.xml({ indent: true }))
})
