import { getXataClient } from '@/lib/xata';

const xata = getXataClient();

export default async function handler(req, res) {
  const { siteUrl, images, dateCollected } = JSON.parse(req.body);

  const siteRecord = await xata.db.Sites.create({
    siteUrl,
    dateCollected
  });

  const imagesToCache = images.map(image => {
    return {
      ...image,
      optimized: JSON.stringify(image.optimized),
      upload: JSON.stringify(image.upload),
      original: JSON.stringify(image.original),
      siteUrl
    }
  })

  const imagesRecords = await xata.db.Images.create(imagesToCache)

  res.status(200).json({
    status: "Ok"
  })
}  