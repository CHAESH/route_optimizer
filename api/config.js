export default function handler(req, res) {
    res.status(200).json({
        KAKAO_MAPS_API_KEY: process.env.KAKAO_MAPS_API_KEY
    });
} 