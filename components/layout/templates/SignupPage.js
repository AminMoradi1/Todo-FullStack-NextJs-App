import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const signUpHandler = async () => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    console.log(data);
    if (data.message === "user exsist already!")
      toast.error("user already exsist!❌");

    if (data.message === "fill all the fileds")
      toast.error("Fill All the Fields❌");
    if (data.status === "success") router.push("/signin");
  };
  return (
    <div className="signin-form">
      <h3>Registration Form</h3>
      <input
        placeholder="Email"
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={signUpHandler}>Register</button>
      <div>
        <p>Have an account?</p>
        <Link href={"/signin"}>Sign In</Link>
      </div>
      <ToastContainer />
    </div>
  );
}

export default SignupPage;
