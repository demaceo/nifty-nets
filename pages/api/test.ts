import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {

        if (req.method === 'GET') {
            return res.status(200).json({ message: 'Test GET successful', timestamp: new Date().toISOString() });
        }

        if (req.method === 'POST') {
            return res.status(200).json({
                message: 'Test POST successful',
                body: req.body,
                timestamp: new Date().toISOString()
            });
        }

        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });

    } catch (error) {
        console.error('Test API Error:', error);
        return res.status(500).json({ error: 'Test API failed', details: (error as Error).message });
    }
}
