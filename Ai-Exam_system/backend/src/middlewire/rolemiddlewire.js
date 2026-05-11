export const isTeacher = (req, res, next) => {
  if (req.user && req.user.role === "teacher") {
  req.user

    next();
  } else {
    return res.status(403).json({ message: "Access denied (Teacher only)" });
  }
};