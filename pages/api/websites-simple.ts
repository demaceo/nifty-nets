import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-key');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    console.log('API called with method:', req.method);
    console.log('Environment NODE_ENV:', process.env.NODE_ENV);

    try {
        if (req.method === 'GET') {
            console.log('Processing GET request...');
            const sites = await prisma.website.findMany({
                orderBy: { createdAt: 'desc' },
            });
            console.log('Found sites:', sites.length);
            return res.status(200).json(sites);
        }

        if (req.method === 'POST') {
            console.log('Processing POST request...');

            // Check admin authentication for POST requests
            const adminKey = req.headers['x-admin-key'];
            const expectedKey = process.env.ADMIN_KEY;

            console.log('Admin key check:', {
                hasAdminKey: !!adminKey,
                hasExpectedKey: !!expectedKey,
                keysMatch: adminKey === expectedKey
            });

            if (!adminKey || adminKey !== expectedKey) {
                console.log('Authentication failed');
                return res.status(401).json({
                    error: 'Unauthorized',
                    details: 'Invalid or missing admin key'
                });
            }

            const { url, videoSourceUrl, categories, notes } = req.body as {
                url: string;
                videoSourceUrl: string;
                categories: string[];
                notes?: string;
            };

            console.log('Request body:', { url, videoSourceUrl, categories, notes });

            // Validate required fields
            if (!url || !videoSourceUrl) {
                console.log('Validation failed: missing required fields');
                return res.status(400).json({
                    error: 'Missing required fields: url and videoSourceUrl are required'
                });
            }

            // Create website without metadata for now to avoid potential issues
            console.log('Creating website in database...');
            const site = await prisma.website.create({
                data: {
                    url,
                    videoSourceUrl,
                    categories: categories || [],
                    notes: notes || null,
                    title: null, // We'll add metadata fetching later once basic functionality works
                    description: null,
                    image: null,
                },
            });

            console.log('Website created successfully:', site.id);
            return res.status(201).json(site);
        }

        console.log('Method not allowed:', req.method);
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });

    } catch (error) {
        console.error('API Error:', error);
        console.error('Error stack:', (error as Error).stack);

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

            // More specific Prisma errors
            if (error.message.includes('P2002')) {
                return res.status(400).json({
                    error: 'A record with this data already exists.'
                });
            }

            if (error.message.includes('P2025')) {
                return res.status(404).json({
                    error: 'Record not found.'
                });
            }
        }

        return res.status(500).json({
            error: 'Internal server error',
            details: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Something went wrong'
        });
    }
}
