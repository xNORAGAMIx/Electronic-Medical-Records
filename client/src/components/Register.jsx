import { Link } from "react-router-dom"

const Register = () => {
  return (
    <div>
      <Link to="/patient-register">Patient</Link>
      <Link to="/doctor-register">Doctor</Link>
    </div>
  )
}

export default Register
