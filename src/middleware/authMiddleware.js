import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
	try{
		const authHeader = req.headers.authorization;

		if(!authHeader || !authHeader.startsWith("Bearer ")){
			return res.status(401).json({message: "인증 토큰이 없습니다."});
		}

		const token = authHeader.split(" ")[1];
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		req.user = {
			userId: decoded.userId,
		};

		next();
	} catch (err){
		return res.status(401).json({message: "유효하지 않은 토큰입니다."});
	}
}