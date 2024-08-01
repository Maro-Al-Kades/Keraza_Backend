const jwt = require("jsonwebtoken");

//~ VERIFY TOKEN
function verifyToken(req, res, next) {
  const authToken = req.headers.authorization;

  if (authToken) {
    const token = authToken.split(" ")[1];
    try {
      const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decodedPayload;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token, access denied" });
    }
  } else {
    return res
      .status(401)
      .json({ message: "No Token Provided, access denied" });
  }
}

//~ VERIFY TOKEN & ADMIN
function verifyTokenAndAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return res
        .status(403)
        .json({ message: "غير مسموح الوصول لهذه المعلومات الا للادمن فقط" });
    }
  });
}

//~ VERIFY TOKEN & USER
function verifyTokenAndOnlyUser(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id) {
      next();
    } else {
      return res
        .status(403)
        .json({ message: "غير مسموح الوصول لهذه المعلومات الا لصاحب الحساب" });
    }
  });
}

//~ VERIFY TOKEN & AUTHORIZATION
function verifyTokenAndAuthorization(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({
        message: "غير مسموح الوصول لهذه المعلومات الا لصاحب الحساب او الادمن",
      });
    }
  });
}

module.exports = {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndOnlyUser,
  verifyTokenAndAuthorization,
};
