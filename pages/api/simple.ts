import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('Simple API called');
    console.log('Method:', req.method);
    console.log('Environment:', process.env.NODE_ENV);

    if (req.method === 'GET') {
        return res.status(200).json({
            message: 'Simple API works!',
            method: req.method,
            timestamp: new Date().toISOString(),
            env: process.env.NODE_ENV
        });
    }

    if (req.method === 'POST') {
        return res.status(200).json({
            message: 'Simple POST works!',
            body: req.body,
            timestamp: new Date().toISOString()
        });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
