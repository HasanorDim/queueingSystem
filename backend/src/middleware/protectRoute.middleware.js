import jwt, { decode } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token)
      return res
        .status(401)
        .json({ message: "Unauthorized - No token Provided! " });

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if (!decode)
      return res.status(401).json({ message: "Unauthorized - Invalid Token!" });

    req.user = decode;

    next();
  } catch (error) {
    console.log("Error in protectRoute");
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export const protectTicketRoute = (req, res, next) => {
  const token = req.cookies.jwt_ticket; // Read JWT from the correct cookie name

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized - No token provided!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    req.ticketId = decoded.ticketId; // Attach ticketId to req

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.log("Error in protectTicketRoute", error);
    return res.status(401).json({ message: "Unauthorized - Invalid token!" });
  }
};

export const protectUserTicketRoute = (req, res, next) => {
  const token = req.cookies.jwt_ticket_user; // Read JWT from the correct cookie name

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized - No token provided!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    req.userTicketId = decoded.userTicketId; // Attach ticketId to req

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.log("Error in protectTicketRoute", error);
    return res.status(401).json({ message: "Unauthorized - Invalid token!" });
  }
};
