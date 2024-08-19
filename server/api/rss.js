import RSS from 'rss';

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
  const host = event.node.req.headers.host;
  const protocol = event.node.req.headers['x-forwarded-proto'] || 'http';
  const webDomain = `${protocol}://${host}/`;

  const feed = new RSS({
    title: 'Bundle Lines',
    description: 'Bundle Lines RSS Feed',
    feed_url: `${webDomain}api/rss`,
    site_url: webDomain,
    language: 'en',
  });

  const caricatures = await getAll();

  const getMimeType = (url) => {
    const ext = url.split('.').pop().toLowerCase();
    switch (ext) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'gif':
        return 'image/gif';
      case 'mp4':
        return 'video/mp4';
      case 'webm':
        return 'video/webm';
      case 'ogg':
        return 'video/ogg';
      case 'mov':
        return 'video/quicktime';
      default:
        return 'application/octet-stream'; // General binary type
    }
  };

  caricatures?.forEach((caricatur) => {
    if (caricatur.news && caricatur.news.length > 0) {
      caricatur?.news?.forEach((item, itemIndex) => {
        item?.content?.forEach((content) => {
          let descriptionContent = '';

          if (content.url) {
            const mimeType = getMimeType(content.url);

            if (mimeType.startsWith('video/')) {
              descriptionContent += `<video controls src="${content.url}" alt="${item.description.replace(/<\/?[^>]+>/gi, '') || 'No title'}"></video>`;
            } else {
              descriptionContent += `<img src="${content.url}" alt="${item.description.replace(/<\/?[^>]+>/gi, '') || 'No title'}" />`;
            }
          }

          if (content.description) {
            descriptionContent += `<p>${content.description}</p>`;
          }

          feed.item({
            title: item.description.replace(/<\/?[^>]+>/gi, ''),
            description: item.description.replace(/<\/?[^>]+>/gi, ''),
            url: `${webDomain}detail/${caricatur._id}?newsId=${content?.uuid || "null"}`,
            date: caricatur.createdAt || new Date().toISOString(),
            custom_elements: [
              { 'content:encoded': descriptionContent },
              content.url ? { 'enclosure': { _attr: { url: content.url, type: getMimeType(content.url) } } } : null,
              { 'firstLink':  `${webDomain}newsletter/${caricatur._id}` },
            ].filter(Boolean),
          });
        });
      });
    }
  });

  event.node.res.setHeader('Content-Type', 'application/xml');
  event.node.res.end(feed.xml({ indent: true }));
});
