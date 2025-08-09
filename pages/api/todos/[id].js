import connectDB from "@/utils/connectDB";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import User from "@/models/User";

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "failed", message: "error in connecting to database" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res(401).json({
      status: "failed",
      message: "you are not Logged In",
    });
  }

  const { id } = req.query;
  console.log("Id", id);

  if (req.method === "POST") return;

  if (req.method === "GET") {
    try {
      const user = await User.findOne({ email: session.user.email });
      if (!user) {
        return res
          .status(404)
          .json({ status: "failed", message: "User Not Found!" });
      }

      const todo = user.todos.find((todo) => String(todo._id) === String(id));
      if (!todo)
        res.status(404), json({ status: "failed", message: "todo Not Found!" });

      res.status(200).json({ status: "success", data: todo });
    } catch (err) {
      res.status(500).json({ status: "failed", message: err.message });
    }
  } else if (req.method === "PATCH") {
    const { title, status, description } = req.body;
    console.log("TITLE , STATUS , DESCRIPTION:" , { title, status, description });

    if (!title && !status) {
      return res
        .status(422)
        .json({ status: "failed", message: "Invalid Data!" });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return res
        .status(404)
        .json({ status: "failed", message: "User Not Found!" });
    }

    const findTodo = await user.todos.id(id);

    if (!findTodo) {
      res.status(404).json({ status: "failed", message: "Todo not Found!" });
    }

    if (typeof title !== "undefined") {
      findTodo.title = title;
    }
    if (typeof status !== "undefined") {
      findTodo.status = status;
    }
    if (typeof description !== "undefined") {
      findTodo.description = description;
    }
    console.log("updatedTodo:", findTodo);

    await user.save();

    return res.status(200).json({ status: "success", data: findTodo });
  }
}
