import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register(){

  const navigate = useNavigate();

  const [formData,setFormData] = useState({
    fullName:"",
    mobile:"",
    email:"",
    password:"",
    referralCode:""
  });


  const handleChange=(e)=>{
    setFormData({
      ...formData,
      [e.target.name]:e.target.value
    });
  };


  const handleRegister=async(e)=>{
    e.preventDefault();

    try{

      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );

      console.log("Register Success:",res.data);

      alert("Registration Successful");

      navigate("/login");


    }catch(error){

      console.log(
        "Register Error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message || "Registration Failed"
      );

    }

  };


  return(
    <div>

      <h2>NexaChain Register</h2>

      <form onSubmit={handleRegister}>

        <input
        name="fullName"
        placeholder="Full Name"
        onChange={handleChange}
        />

        <br/>

        <input
        name="mobile"
        placeholder="Mobile"
        onChange={handleChange}
        />

        <br/>

        <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
        />

        <br/>

        <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        />

        <br/>

        <input
        name="referralCode"
        placeholder="Referral Code"
        onChange={handleChange}
        />

        <br/>

        <button type="submit">
          Register
        </button>


      </form>

    </div>
  )

}

export default Register;