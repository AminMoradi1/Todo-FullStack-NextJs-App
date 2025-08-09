import { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import ProfileForm from "../module/ProfileForm";
import ProfileData from "./ProfileData";
import { MdEdit } from "react-icons/md";

function ProfilePage() {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [data, setData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const res = await fetch("/api/profile");
    const result = await res.json();
    if (result.status === "success" && result.data.name && result.data.lastName) {
      setData(result.data);
    }
  };

  const submitHandler = async () => {
    const res = await fetch("/api/profile", {
      method: "POST",
      body: JSON.stringify({ name, lastName, password }),
      headers: { "Content-Type": "application/json" },
    });
    const result = await res.json();
    if (result.status === "success") {
      setIsEditing(false); 
    }
  };

  const editProfileHandler = () => {
    if (data) {
      setName(data.name);
      setLastName(data.lastName);
      setPassword(""); 
    }
    setIsEditing(true);
  };

  return (
    <div className="profile-form">
      <h2>
        <CgProfile /> Profile
      </h2>

      {isEditing ? (
        <ProfileForm
          name={name}
          lastName={lastName}
          password={password}
          setName={setName}
          setLastName={setLastName}
          setPassword={setPassword}
          submitHandler={submitHandler}
          email={email}
          setEmail={setEmail}
        />
      ) : data ? (
        <ProfileData data={data} />
      ) : (
        <p>Loading profile...</p>
      )}

      {!isEditing && data && (
        <button className="edit-button" onClick={editProfileHandler}>
          Edit Info
          <MdEdit className="edit-icon" />
        </button>
      )}
    </div>
  );
}

export default ProfilePage;