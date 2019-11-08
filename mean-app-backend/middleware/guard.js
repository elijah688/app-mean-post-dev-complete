const jwt = require('jsonwebtoken')
const JWK_SECRET = process.env.JWT_KEY;

module.exports = (req, res, next) => {
	try {
		const authorization = req.headers.authorization;
		const decoded = jwt.verify(authorization, JWK_SECRET);
		res.userData = {id: decoded.id, username: decoded.username }
		next();
	}
	catch (e) {
		res.status(401).json({
			message: "You are not authenticated!"
		});
	}
}
