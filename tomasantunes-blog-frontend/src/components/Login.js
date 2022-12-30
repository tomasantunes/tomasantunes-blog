import React, {useState} from 'react';
import axios from 'axios';
import config from '../config.json';
import {useNavigate} from 'react-router-dom';

export default function Login() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  function changeUser(event) {
    setUser(event.target.value);
  }

  function changePass(event) {
    setPass(event.target.value);
  }

  function requestLogin() {
    axios.post(config.BASE_URL + "/api/check-login", {user, pass})
    .then(res => {
      if (res.data.status == "OK") {
        console.log(res.data.data);
        navigate("/admin");
      }
      else {
        console.log(res.data.data);
      }
    })
    .catch(err => {
      console.log(err.message);
    });
  }

  return (
    <div className="login-box">
      <div style={{textAlign: "center"}}>
        <h3>Login</h3>
      </div>
      <div className="form-group">
          <label>Username</label>
          <input type="text" className="form-control" value={user} onChange={changeUser} />
      </div>
      <div className="form-group mb-4">
          <label>Password</label>
          <input type="password" className="form-control" value={pass} onChange={changePass} />
      </div>
      <div style={{textAlign: "right"}}>
          <button className="btn btn-primary" onClick={requestLogin}>Login</button>
      </div>
    </div>
  )
}
