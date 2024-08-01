import bcrypt from "bcryptjs";

const comparePassword = (password, hashPassword) => {
   return bcrypt.compare(password, hashPassword);
}

export default comparePassword;