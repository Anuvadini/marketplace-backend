import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const DEBUG = process.env.DEBUG === "true";
  if (DEBUG) {
    req.user = { id: "testuser" };
    return next();
  }
  let token = req.header("Authorization");
  if (token && token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }
  if (!token) return res.status(401).send("Access denied");
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).send("Invalid token");
  }
};
