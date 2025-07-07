import fetch from 'node-fetch';
import metascraper from 'metascraper';
import createUrl from 'metascraper-url';
import createTitle from 'metascraper-title';
import createDescription from 'metascraper-description';
import createImage from 'metascraper-image';

const scraper = metascraper([
    createUrl(),
    createTitle(),
    createDescription(),
    createImage(),
]);

export async function fetchMetadata(url: string) {
    const res = await fetch(url);
    const html = await res.text();
    return await scraper({ html, url });
}