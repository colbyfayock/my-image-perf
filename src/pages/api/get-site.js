import { getXataClient } from '@/lib/xata';

const xata = getXataClient();

export default async function handler(req, res) {
  const { url } = req.query;

  const site = await xata.db.Sites.filter({ siteUrl: url }).getFirst();
  let images = await xata.db.Images.filter({ siteUrl: url }).getAll();

  images = images.map(image => {
    return {
      ...image,
      optimized: JSON.parse(image.optimized),
      upload: JSON.parse(image.upload),
      original: JSON.parse(image.original),
    }
  })

  res.status(200).json({
    site,
    images
  })
}  