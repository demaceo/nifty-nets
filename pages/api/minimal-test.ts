import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {

    // Set basic headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        return res.status(200).json({
            message: 'GET works',
            timestamp: new Date().toISOString()
        });
    }

    if (req.method === 'POST') {
        return res.status(200).json({
            message: 'POST works',
            receivedData: req.body,
            timestamp: new Date().toISOString()
        });
    }

    return res.status(405).json({
        error: `Method ${req.method} not allowed`,
        allowedMethods: ['GET', 'POST'],
        receivedMethod: req.method,
        timestamp: new Date().toISOString()
    });
}
