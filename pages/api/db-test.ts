import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Simple database test
        await prisma.$queryRaw`SELECT 1 as test`;

        // Test if Website table exists and count records
        const count = await prisma.website.count();

        return res.status(200).json({
            message: 'Database connection successful',
            websiteCount: count,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        return res.status(500).json({
            error: 'Database connection failed',
            details: (error as Error).message
        });
    }
}
