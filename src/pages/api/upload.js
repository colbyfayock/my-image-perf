import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export default async function handler(req, res) {
  const { images } = JSON.parse(req.body);

  const uploads = [];

  for ( const image of images ) {
    const results = await cloudinary.uploader.upload(image.src, {
      folder: 'my-image-perf'
    })
    uploads.push(results);
  }

  res.status(200).json({
    data: uploads
  })
}
