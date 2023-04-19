import { useState, useEffect } from 'react';
import { getCldImageUrl, CldImage } from 'next-cloudinary';
import { co2 } from '@tgwf/co2'

import Layout from '@/components/Layout';
import Section from '@/components/Section';
import Container from '@/components/Container';
import Button from '@/components/Button';

import styles from '@/styles/Home.module.scss';

const swd = new co2({ model: 'swd' })

export default function Home() {
  const [siteUrl, setSiteUrl] = useState();
  const [siteImages, setSiteImages] = useState()
  const [error, setError] = useState();

  function handleOnChange() {
    setSiteUrl();
    setError();
  }

  async function handleOnSubmit(e) {
    e.preventDefault();
    
    const fields = Array.from(e.currentTarget.elements);
    let url = fields.find(el => el.name === 'url')?.value;

    if ( !url ) {
      setError('Please set a valid URL.');
      return;
    }

    if ( !/^http(s)?:\/\//.test(url) ) {
      url = `https://${url}`;
    }

    setSiteUrl(url);
  }

  useEffect(() => {
    if ( !siteUrl ) return;
    
    (async function run () {

      const cache = await fetch(`/api/get-site?url=${siteUrl}`).then(r => r.json());

      if ( cache?.site && cache?.images ) {
        setSiteImages(cache.images);
        return;
      }

      const { images: websiteImages } = await fetch(`/api/scrape?url=${siteUrl}`).then(r => r.json());

      const { data: uploads } = await fetch('/api/upload', {
        method: 'POST',
        body: JSON.stringify({
          images: websiteImages
        })
      }).then(r => r.json())
      
      const images = await Promise.all(uploads.map(async (image, i) => {
        const optimizedUrl = getCldImageUrl({
          src: image.public_id,
          format: 'avif'
        })
        const optimizedSize = (await fetch(optimizedUrl).then(r => r.blob())).size;
        return {
          width: image.width,
          height: image.height,
          original: {
            url: websiteImages[i].src,
            size: image.bytes,
            format: image.format,
            co2: swd.perVisit(image.bytes)
          },
          upload: {
            url: image.secure_url,
            publicId: image.public_id,
          },
          optimized: {
            url: optimizedUrl,
            format: 'avif',
            size: optimizedSize,
            co2: swd.perVisit(optimizedSize)
          }
        }
      }))

      setSiteImages(images);

      await fetch('/api/add-site', {
        method: 'POST',
        body: JSON.stringify({
          images,
          siteUrl,
          dateCollected: new Date(Date.now()).toISOString()
        })
      })

    })();

  }, [siteUrl]);

  return (
    <Layout>
      <Section>
        <Container className={styles.homeContainer}>
          <h1>Test your website!</h1>
          <form className={styles.form} onSubmit={handleOnSubmit}>
            <input className={styles.input} type="text" name="url" onChange={handleOnChange} />
            <Button className={styles.button}>Test</Button>
          </form>
          {siteUrl && <p>Testing { siteUrl }</p>}
          {!siteUrl && !error && <p>Enter your website URL above to get started!</p>}
          {error && <p className={styles.error}>{ error }</p>}
        </Container>
      </Section>
      <Section>
        <Container>
          <ul className={styles.images}>
            {siteImages?.map(image => {
              return (
                <li key={image.original.url} className={styles.imagesRow}>
                  <div className={styles.imageOriginal}>
                    <CldImage width="1200" height="799" src={image.upload.url} alt="Original" />
                    <h3>Original</h3>
                    <ul>
                      <li>Format: {image.original.format}</li>
                      <li>Size: {image.original.size / 1000}kb</li>
                      <li>co2: {image.original.co2}g</li>
                    </ul>
                  </div>
                  <div className={styles.imageOptimized}>
                    <CldImage width="1200" height="799" src={image.upload.url} alt="Optimized" />
                    <h3>Optimized</h3>
                    <ul>
                      <li>Format: {image.optimized.format}</li>
                      <li>Size: {image.optimized.size / 1000}kb</li>
                      <li>co2: {image.optimized.co2}g</li>
                    </ul>
                  </div>
                </li>
              )
            })}
            
          </ul>
        </Container>
      </Section>
    </Layout>
  )
}