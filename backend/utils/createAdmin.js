// const User = require("../models/User");
// const bcrypt = require("bcryptjs");

// const createAdmin = async () => {
//   const adminEmail = "didrukshratheesh2003@gmail.com";

//   const adminExists = await User.findOne({ email: adminEmail });
//   if (adminExists) {
//     console.log("Admin already exists");
//     return;
//   }
//   const hashedPassword = await bcrypt.hash("did1234", 10);
//   await User.create({
//     username: "Super Admin",
//     email: adminEmail,
//     phone: "9999999999",
//     password: hashedPassword,
//     role: "admin",
//     isVerified: true
//   });
//   console.log("Admin created successfully");
// };
// module.exports = createAdmin;

const User = require("../models/User");
const bcrypt = require("bcryptjs");

const createAdmin = async () => {
  try {
    const adminEmail = "didruksh@gmail.com";
    const adminExists = await User.findOne({ email: adminEmail });
    if (adminExists) {
      console.log("Admin already exists");
      return;
    }
    const hashedPassword = await bcrypt.hash("did1234", 10);

    await User.create({
      name: "Super Admin",          
      email: adminEmail,
      phone: "9886673576",
      password: hashedPassword,
      role: "admin",
      isVerified: true
    });
    console.log("Admin created successfully");
  } catch (err) {
    console.error("Error creating admin:", err.message);
  }
};
module.exports = createAdmin;


