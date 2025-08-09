import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function EditTodoPage() {
  const router = useRouter();
  const { id } = router.query;

  const [todo, setTodo] = useState(null);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchTodo = async () => {
      const res = await fetch(`/api/todos/${id}`);
      const data = await res.json();
      console.log(data);

      setTodo(data.data);
      setTitle(data.data.title);
      setStatus(data.data.status);
      setDescription(data.data.description);
    };
    fetchTodo();
  }, [id]);

  const handleUpdate = async () => {
    console.log({ title, status, description });

    const res = await fetch(`/api/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description, title, status }),
    });

    const data = await res.json();
    console.log(data);

    if (data.status === "success") {
      router.push("/");
    }
  };

  if (!todo) return <p>Loading...</p>;

  return (
    <div className="edit-form">
      <h2>Edit Todo</h2>
      <div>
        <label htmlFor="title">Title</label>
        <input
          className="add-form__input--first"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <input
          className="add-form__input--first"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label>Status</label>
        <select
          className="select-option"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="todo">Todo</option>
          <option value="inProgress">In Progress</option>
          <option value="review">Review</option>
          <option value="done">Done</option>
        </select>
      </div>

      <button onClick={handleUpdate}>Save</button>
    </div>
  );
}

export default EditTodoPage;
