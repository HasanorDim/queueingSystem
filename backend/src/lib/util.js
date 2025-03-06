import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const setTokenOnCookie = (token, res) => {
  res.cookie("jwt", token, {
    httpOnly: true, // Prevent JavaScript access (XSS protection)
    sameSite: "strict", // Prevent CSRF attacks
    secure: process.env.NODE_ENV !== "development", // Use HTTPS in production
    // maxAge: 60 * 60 * 1000, // 1 hour expiration
  });
};

export const setTicketTokenOnCookie = (token, res) => {
  res.cookie("jwt_ticket", token, {
    httpOnly: true, // Prevent JavaScript access (XSS protection)
    sameSite: "strict", // Prevent CSRF attacks
    secure: process.env.NODE_ENV !== "development", // Use HTTPS in production
    // maxAge: 60 * 60 * 1000, // 1 hour expiration
  });
};

export const setUserTicketTokenOnCookie = (token, res) => {
  res.cookie("jwt_ticket_user", token, {
    httpOnly: true, // Prevent JavaScript access (XSS protection)
    sameSite: "strict", // Prevent CSRF attacks
    secure: process.env.NODE_ENV !== "development", // Use HTTPS in production
    // maxAge: 60 * 60 * 1000, // 1 hour expiration
  });
};
