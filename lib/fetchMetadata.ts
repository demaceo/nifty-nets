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
    try {
        // Use native fetch instead of node-fetch
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            // Add timeout
            signal: AbortSignal.timeout(10000) // 10 seconds timeout
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const html = await response.text();
        const metadata = await scraper({ html, url });
        console.log('metadata', metadata)

        return {
            title: metadata.title || undefined,
            description: metadata.description || undefined,
            image: metadata.image || undefined,
            url: metadata.url || url
        };
    } catch (error) {
        console.error('Error fetching metadata:', error);
        // Return empty metadata on error
        return {
            title: undefined,
            description: undefined,
            image: undefined,
            url: url
        };
    }
}