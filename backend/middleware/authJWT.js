const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ message: "Unauthorized" });
    if (!allowedRoles.includes(req.user.role))
      return res.status(403).json({
        message: "Forbidden: Insufficient permissions",
        requiredRole: allowedRoles,
        yourRole: req.user.role,
      });
    next();
  };
};

module.exports = { requireRole };
