import User from "@/models/User";
import connectDB from "@/utils/connectDB";
import { sortTodos } from "@/utils/sortTodos";
// import { getSession } from "next-auth/react";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";

async function handler(req, res) {
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
  console.log("user: ", user);

  if (!user) {
    return res
      .status(404)
      .json({ status: "failed", message: "user Not Found!" });
  }

  if (req.method === "POST") {
    const { title, status } = req.body;

    if (!title || !status) {
      return res
        .status(422)
        .json({ status: "failed", message: "Invalid data!" });
    }

    user.todos.push({ title, status });
    await user.save();

    res
      .status(201)
      .json({ status: "success", message: "Todo created successfully!" });
  } else if (req.method === "GET") {
    const sortedData = sortTodos(user.todos);

    res.status(200).json({ status: "success", data: { todos: sortedData } });
  } else if (req.method === "PATCH") {
    const { id, status } = req.body;
    console.log("status , Id:", { status, id });

    if (!id || !status) {
      return res
        .status(422)
        .json({ status: "failed", message: "Invalid Data" });
    }

    const result = await User.updateOne(
      { "todos._id": id },
      { $set: { "todos.$.status": status } }
    );
    console.log("updated Data:", result);
    return res
      .status(200)
      .json({ status: "success", message: "updated successfully!" });
  }
}

export default handler;
