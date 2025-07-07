import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { fetchMetadata } from '@/lib/fetchMetadata';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const sites = await prisma.website.findMany({
            orderBy: { title: 'asc' },
        });
        return res.status(200).json(sites);
    }

    if (req.method === 'POST') {
        const { url, videoSourceUrl, categories, notes } = req.body as {
            url: string;
            videoSourceUrl: string;
            categories: string[];
            notes?: string;
        };

        // Try to fetch metadata; on failure, fall back to an empty object
        const meta = (await fetchMetadata(url).catch(() => ({} as {
            title?: string;
            description?: string;
            image?: string;
        })));

        const title = meta.title ?? null;
        const description = meta.description ?? null;
        const image = meta.image ?? null;

        const site = await prisma.website.create({
            data: {
                url,
                videoSourceUrl,
                categories,
                notes,
                title,
                description,
                image,
            },
        });

        return res.status(201).json(site);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
}
