import User from "@/models/User";
import { hashPassword } from "@/utils/auth";
import connectDB from "@/utils/connectDB";

export default async function handler(req, res) {
  if (req.method !== "POST") return;

  try {
    await connectDB();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "failed", message: "error in connecting to database" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(422)
      .json({ status: "failed", message: "fill all the fileds" });
  }

  const exsistingUser = await User.findOne({ email });

  const hashedPassword = await hashPassword(password);

  if (exsistingUser) {
    return res
      .status(422)
      .json({ status: "failed", message: "user exsist already!" });
  }

  const newUser = await User.create({ email: email, password: hashedPassword });
  console.log(newUser);
  return res
    .status(201)
    .json({ status: "success", message: "user created successfully!" });
}
