import { RiMastodonLine } from "react-icons/ri";
import { BiRightArrow, BiLeftArrow } from "react-icons/bi";
import { MdEdit } from "react-icons/md";
import { useRouter } from "next/router";
import Link from "next/link";

function Tasks({ data, next, back, fetchTodos }) {
  console.log({ data });

  const changeStatus = async (id, status) => {
    const res = await fetch("/api/todos", {
      method: "PATCH",
      body: JSON.stringify({ id, status }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    console.log("data result:", data);
    if (data.status === "success") fetchTodos();
  };

  const router = useRouter();

  const editHandler = (id) => {
    router.push(`/edit-todo/${id}`);
  };
  return (
    <div className="tasks">
      {data?.map((i) => (
        <div key={i._id} className="tasks__card">
          <Link href={`/todo/${i._id}`}>
            <div className="edit-todo">
              <span className={i.status}></span>
              <button
                className="edit-button"
                onClick={() => editHandler(i._id)}
              >
                <MdEdit className="edit-icon" />
              </button>
            </div>

            <RiMastodonLine />
            <h4>{i.title}</h4>
            <div>
              {back ? (
                <button
                  className="button-back"
                  onClick={() => changeStatus(i._id, back)}
                >
                  <BiLeftArrow />
                  Back
                </button>
              ) : null}
              {next ? (
                <button
                  className="button-next"
                  onClick={() => changeStatus(i._id, next)}
                >
                  Next <BiRightArrow />
                </button>
              ) : null}
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default Tasks;
