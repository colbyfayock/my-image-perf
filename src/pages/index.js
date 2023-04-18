import { useState, useEffect } from 'react';

import Layout from '@/components/Layout';
import Section from '@/components/Section';
import Container from '@/components/Container';
import Button from '@/components/Button';

import styles from '@/styles/Home.module.scss';

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

    await runTests();
  }

  useEffect(() => {
    if ( !siteUrl ) return;
    // Scrape site here!
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
            <li className={styles.imagesRow}>
              <div className={styles.imageOriginal}>
                <img width="1200" height="799" src="https://images.unsplash.com/photo-1526666923127-b2970f64b422?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80" alt="Original" />
                <h3>Original</h3>
                <ul>
                  <li>Format: -</li>
                  <li>Size: -</li>
                  <li>co2: -</li>
                </ul>
              </div>
              <div className={styles.imageOptimized}>
                <img width="1200" height="799" src="https://images.unsplash.com/photo-1526666923127-b2970f64b422?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80" alt="Optimized" />
                <h3>Optimized</h3>
                <ul>
                  <li>Format: -</li>
                  <li>Size: -</li>
                  <li>co2: -</li>
                </ul>
              </div>
            </li>
          </ul>
        </Container>
      </Section>
    </Layout>
  )
}