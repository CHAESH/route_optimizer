// Vercel Serverless Function for Kakao Geocoding API
const KAKAO_API_KEY = process.env.KAKAO_API_KEY;

export default async function handler(req, res) {
    // CORS 설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { address } = req.query;
    
    if (!address) {
        return res.status(400).json({ success: false, error: 'Address is required' });
    }

    try {
        const response = await fetch(
            `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`,
            {
                headers: {
                    'Authorization': `KakaoAK ${KAKAO_API_KEY}`
                }
            }
        );

        const data = await response.json();
        
        if (data.documents && data.documents.length > 0) {
            const result = data.documents[0];
            return res.status(200).json({
                success: true,
                result: {
                    lat: parseFloat(result.y),
                    lng: parseFloat(result.x)
                }
            });
        }

        return res.status(404).json({
            success: false,
            error: 'Address not found'
        });

    } catch (error) {
        console.error('Geocoding error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
} 