import { useState } from "react";

function Register() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      alert(data.message);

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h2>Register</h2>

      <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
      />

      <br /><br />

      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
      />

      <br /><br />

      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default Register;