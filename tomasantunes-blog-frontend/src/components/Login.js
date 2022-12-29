import React from 'react'

export default function Login() {
  return (
    <>
        <div>Login</div>
        <div className="form-group">
            <label>Username</label>
            <input type="text" className="form-control" />
        </div>
        <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-control" />
        </div>
        <div style={{textAlign: "right"}}>
            <button className="btn btn-primary">Login</button>
        </div>
    </>
  )
}
