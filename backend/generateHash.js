import bcrypt from "bcryptjs";

const plainPassword = "Demo123";

bcrypt.hash(plainPassword, 10).then((hash) => {
  console.log("Hash:", hash);
});
