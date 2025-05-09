import supabase from "../config/supabase.js";

export const authsignUpUser = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      if (error.message.includes("Email rate limit exceeded")) {
        // Implement retry logic here or notify the user to try again later
        console.log("Too many requests. Please try again later.");
        // return { success: false, message: error.message };
        throw { message: "Too many email requests. Please try again later." };
      } else {
        console.error("Error signing up:", error.message);
        // return { success: false, message: error.message };
        // throw { message: error.message}
        return { success: false, message: error.message };
      }
    }

    // console.log('data.user.id', data.user.id)
    // return data.user.id;
    return { success: true, userId: data.user.id };
  } catch (err) {
    console.error(err);
    console.log("Error creating auth users: ", err.message);
  }
};
