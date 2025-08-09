import Link from "next/link";
import { VscListSelection } from "react-icons/vsc";
import { BiMessageSquareAdd } from "react-icons/bi";
import { RxDashboard } from "react-icons/rx";
import { FiLogOut, FiMenu } from "react-icons/fi";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

function Layout({ children }) {
  const { status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const logOutHandler = () => {
    signOut();
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="container">
      <header className="header">
        <p>Todo App</p>
        <div className="header-actions">
          {/* فقط در دسکتاپ نمایش داده میشه */}
          {status === "authenticated" && (
            <button className="logout-desktop" onClick={logOutHandler}>
              LogOut <FiLogOut />
            </button>
          )}
          <button className="hamburger" onClick={toggleSidebar}>
            <FiMenu />
          </button>
        </div>
      </header>

      {/* سایدبار کشویی */}
      <div className={`mobile-menu ${sidebarOpen ? "open" : ""}`}>
        <ul>
          <li>
            <VscListSelection />
            <Link href="/" onClick={() => setSidebarOpen(false)}>
              Todos
            </Link>
          </li>
          <li>
            <BiMessageSquareAdd />
            <Link href="/add-todo" onClick={() => setSidebarOpen(false)}>
              Add todo
            </Link>
          </li>
          <li>
            <RxDashboard />
            <Link href="/profile" onClick={() => setSidebarOpen(false)}>
              Profile
            </Link>
          </li>
          {/* لاگ‌اوت فقط در موبایل */}
          {status === "authenticated" && (
            <li>
              <FiLogOut />
              <button className="logout-mobile" onClick={logOutHandler}>
                LogOut
              </button>
            </li>
          )}
        </ul>
      </div>

      <div className="container--main">
        <aside className="sidebar-desktop">
          <p>welcome 👋</p>
          <ul>
            <li>
              <VscListSelection />
              <Link href={"/"}>Todos</Link>
            </li>
            <li>
              <BiMessageSquareAdd />
              <Link href={"/add-todo"}>Add todo</Link>
            </li>
            <li>
              <RxDashboard />
              <Link href={"/profile"}>Profile</Link>
            </li>
          </ul>
        </aside>
        <section>{children}</section>
      </div>
    </div>
  );
}

export default Layout;
