import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.adminId = decoded.adminId;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Geçersiz token" });
    }
  } else {
    return res.status(401).json({ message: "Yetkisiz erişim" });
  }
};
