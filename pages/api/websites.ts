import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

// Configure API route settings
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
        externalResolver: true,
    },
    runtime: 'nodejs', // Ensure we use Node.js runtime, not Edge
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Set CORS headers first
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-key');
    res.setHeader('Access-Control-Max-Age', '86400');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        // Normalize method to uppercase
        const method = req.method?.toUpperCase();

        if (method === 'GET') {
            try {
                const sites = await prisma.website.findMany({
                    orderBy: { createdAt: 'desc' },
                });
                return res.status(200).json(sites);
            } catch (dbError) {
                return res.status(500).json({
                    error: 'Database query failed',
                    details: (dbError as Error).message
                });
            }
        }

        if (method === 'POST') {

            // Check admin authentication for POST requests
            const adminKey = req.headers['x-admin-key'] as string;
            const expectedKey = process.env.ADMIN_KEY;

            if (!adminKey || adminKey !== expectedKey) {
                return res.status(401).json({
                    error: 'Unauthorized',
                    details: 'Invalid or missing admin key'
                });
            }

            // Parse request body
            let bodyData;
            try {
                bodyData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
            } catch {
                return res.status(400).json({
                    error: 'Invalid JSON in request body'
                });
            }

            const { url, videoSourceUrl, categories, notes } = bodyData as {
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

            // Create website in database
            try {
                const site = await prisma.website.create({
                    data: {
                        url: url.trim(),
                        videoSourceUrl: videoSourceUrl.trim(),
                        categories: Array.isArray(categories) ? categories : [],
                        notes: notes?.trim() || null,
                        title: null,
                        description: null,
                        image: null,
                    },
                });

                return res.status(201).json(site);
            } catch (dbError) {
                return res.status(500).json({
                    error: 'Failed to create website',
                    details: (dbError as Error).message
                });
            }
        }

        // Method not allowed
        res.setHeader('Allow', 'GET, POST, OPTIONS');
        return res.status(405).json({
            error: `Method ${method} Not Allowed`,
            allowedMethods: ['GET', 'POST', 'OPTIONS']
        });

    } catch (error) {
        return res.status(500).json({
            error: 'Internal server error',
            details: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Something went wrong',
            timestamp: new Date().toISOString()
        });
    }
}
