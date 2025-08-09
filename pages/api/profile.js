import User from "@/models/User";
import connectDB from "@/utils/connectDB";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { verifyPassword } from "@/utils/auth";

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "failed", message: "error in connecting to database" });
  }

  const sessioned = await getServerSession(req, res, authOptions);

  if (!sessioned) {
    return res
      .status(401)
      .json({ status: "failed", message: "you are not logged IN" });
  }

  const user = await User.findOne({ email: sessioned.user.email });

  if (!user) {
    return res
      .status(404)
      .json({ status: "failed", message: "user Not Found!" });
  }

  if (req.method === "POST") {
    const { name, lastName, password, email } = req.body;
    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      return res.status(422).json({
        status: "falid",
        message: "username or password is incorrect",
      });
    }

    user.name = name;
    user.lastName = lastName;
    user.email = email;
    user.save();

    res.status(200).json({
      status: "success",
      data: { name, lastName, email: sessioned.user.email },
    });
  } else if (req.method === "GET") {
    res.status(200).json({
      status: "success",
      data: { name: user.name, lastName: user.lastName, Email: user.email },
    });
  } else if (req.method === "PATCH") {
    const { name, lastName, email } = req.body;
    console.log({ name, lastName, email });
  }
}
