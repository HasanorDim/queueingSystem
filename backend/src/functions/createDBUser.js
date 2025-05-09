import { verify } from "jsonwebtoken";
import supabase from "../config/supabase.js";

// const verifyEmail = async (email) => {
//   const { data, error } = await supabase
//     .from("user_sample")
//     .select("email")
//     .eq("email", email);

//   if (data) {
//     return console.log("Email Exist");
//   }
// };

export const createDbUser = async (userData) => {
  try {
    const { data, error } = await supabase
      .from("userstb")
      .insert(userData)
      .select();

    // console.log('data', data);
    if (error) throw error;
    return data;
  } catch (err) {
    console.error(err);
    console.log("Error creating users: ", err.message);
  }
};
