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

    console.log('=== API Request Debug ===');
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Body:', req.body);
    console.log('Environment:', process.env.NODE_ENV);
    console.log('========================');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        console.log('Handling OPTIONS request');
        return res.status(200).end();
    }

    try {
        // Normalize method to uppercase
        const method = req.method?.toUpperCase();
        console.log('Normalized method:', method);

        if (method === 'GET') {
            console.log('Processing GET request...');
            try {
                const sites = await prisma.website.findMany({
                    orderBy: { createdAt: 'desc' },
                });
                console.log('Found sites:', sites.length);
                return res.status(200).json(sites);
            } catch (dbError) {
                console.error('Database error in GET:', dbError);
                return res.status(500).json({
                    error: 'Database query failed',
                    details: (dbError as Error).message
                });
            }
        }

        if (method === 'POST') {
            console.log('Processing POST request...');

            // Check admin authentication for POST requests
            const adminKey = req.headers['x-admin-key'] as string;
            const expectedKey = process.env.ADMIN_KEY;

            console.log('Admin key validation:', {
                hasAdminKey: !!adminKey,
                hasExpectedKey: !!expectedKey,
                adminKeyLength: adminKey?.length,
                expectedKeyLength: expectedKey?.length,
                keysMatch: adminKey === expectedKey
            });

            if (!adminKey || adminKey !== expectedKey) {
                console.log('Authentication failed');
                return res.status(401).json({
                    error: 'Unauthorized',
                    details: 'Invalid or missing admin key'
                });
            }

            // Parse request body
            let bodyData;
            try {
                bodyData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
            } catch (parseError) {
                console.error('Body parsing error:', parseError);
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

            console.log('Parsed request data:', { url, videoSourceUrl, categories, notes });

            // Validate required fields
            if (!url || !videoSourceUrl) {
                console.log('Validation failed: missing required fields');
                return res.status(400).json({
                    error: 'Missing required fields: url and videoSourceUrl are required'
                });
            }

            // Create website in database
            console.log('Creating website in database...');
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

                console.log('Website created successfully:', site.id);
                return res.status(201).json(site);
            } catch (dbError) {
                console.error('Database error in POST:', dbError);
                return res.status(500).json({
                    error: 'Failed to create website',
                    details: (dbError as Error).message
                });
            }
        }

        // Method not allowed
        console.log('Method not allowed:', method);
        res.setHeader('Allow', 'GET, POST, OPTIONS');
        return res.status(405).json({
            error: `Method ${method} Not Allowed`,
            allowedMethods: ['GET', 'POST', 'OPTIONS']
        });

    } catch (error) {
        console.error('Unexpected API Error:', error);
        console.error('Error stack:', (error as Error).stack);

        return res.status(500).json({
            error: 'Internal server error',
            details: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Something went wrong',
            timestamp: new Date().toISOString()
        });
    }
}
