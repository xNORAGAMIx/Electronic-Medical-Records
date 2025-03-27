import { Link } from "react-router-dom"

const Login = () => {
  return (
    <div>
      <Link to="/patient-login">Patient</Link>
      <Link to="/doctor-login">Doctor</Link>
    </div>
  )
}

export default Login
