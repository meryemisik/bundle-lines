import RSS from 'rss'

const getAll = async () => {
  try {
    let data = await $fetch("/api/caricatures");
    return data;
  } catch (e) {
    console.error(e);
    throw new Error("Error fetching caricatures data");
  }
};

export default defineEventHandler(async (event) => {

  const host = event.node.req.headers.host
  const protocol = event.node.req.headers['x-forwarded-proto'] || 'http'
  const wedDomain = `${protocol}://${host}/`

  const feed = new RSS({
    title: 'Bundle Lines',
    description: 'Bundle Lines RSS Feed',
    feed_url: `${wedDomain}api/rss`,
    site_url: wedDomain,
    language: 'en',
  })

  const caricatures = await getAll();
  caricatures?.forEach(caricatur => {
    if (caricatur.news && caricatur.news.length > 0) {
      const getFirstImage = caricatur.news.find(
        (obj) => obj.type == 0 || obj.type == 2
      );

      const imageUrl = getFirstImage?.content?.[0]?.url;

      feed.item({
        title: caricatur.title.replace(/<\/?[^>]+>/gi, ''),
        description: `
        <p>${caricatur.sponsor || ''}</p>
        <img src="${imageUrl || ''}" alt="${caricatur.title || 'No title'}" />
      `,
        url: `${wedDomain}newsletter/${caricatur._id}`,
        date: caricatur.createdAt || new Date().toISOString(),
      });
    }
  });


  event.node.res.setHeader('Content-Type', 'application/xml')
  event.node.res.end(feed.xml({ indent: true }))
})
