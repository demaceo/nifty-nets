import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { fetchMetadata } from '@/lib/fetchMetadata';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === 'GET') {
            const sites = await prisma.website.findMany({
                orderBy: { createdAt: 'desc' },
            });
            return res.status(200).json(sites);
        }

        if (req.method === 'POST') {
            // Check admin authentication for POST requests
            const adminKey = req.headers['x-admin-key'];
            if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const { url, videoSourceUrl, categories, notes } = req.body as {
                url: string;
                videoSourceUrl: string;
                categories: string[];
                notes?: string;
            };

            // Validate required fields
            if (!url || !videoSourceUrl) {
                return res.status(400).json({
                    error: 'Missing required fields: url and videoSourceUrl are required'
                });
            }

            // Try to fetch metadata; on failure, fall back to an empty object
            let meta: {
                title?: string;
                description?: string;
                image?: string;
            } = {};

            try {
                meta = await fetchMetadata(url);
            } catch (error) {
                console.warn('Failed to fetch metadata for URL:', url, error);
                // Continue with empty metadata
            }

            const title = meta.title ?? null;
            const description = meta.description ?? null;
            const image = meta.image ?? null;

            const site = await prisma.website.create({
                data: {
                    url,
                    videoSourceUrl,
                    categories: categories || [],
                    notes: notes || null,
                    title,
                    description,
                    image,
                },
            });

            return res.status(201).json(site);
        }

        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });

    } catch (error) {
        console.error('API Error:', error);

        // Handle Prisma-specific errors
        if (error instanceof Error) {
            if (error.message.includes('DATABASE_URL')) {
                return res.status(500).json({
                    error: 'Database connection failed. Please check DATABASE_URL environment variable.'
                });
            }

            if (error.message.includes('Table') && error.message.includes('does not exist')) {
                return res.status(500).json({
                    error: 'Database tables not found. Please run database migrations.'
                });
            }
        }

        return res.status(500).json({
            error: 'Internal server error',
            details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
    }
}
