import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import styles from "../../../styles/TodoDetail.module.css";

function TodoDetail() {
  const [todo, setTodo] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  console.log(id);

  useEffect(() => {
    if (!id) return;
    const fetchTodo = async () => {
      try {
        const res = await fetch(`/api/todos/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error("failed to fetch Todo");
        setTodo(data.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchTodo();
  }, [id]);

  if (!todo) return <h2>Todo Not Found!</h2>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{todo.title}</h1>
      <div className={styles.status}>{todo.status}</div>
      <p className={styles.description}>
        {todo.description || "No descroption Provided!"}
      </p>
    </div>
  );
}

export default TodoDetail;
