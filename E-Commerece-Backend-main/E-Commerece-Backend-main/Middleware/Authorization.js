const jwt = require('jsonwebtoken');

const Authorization = (req, res, next) => {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
        return res.status(400).json({ error: "No Token, authorization denied" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(400).json({ error: "No Token, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, "secret key");
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: "Token is not valid" });
    }
}

module.exports = Authorization;
