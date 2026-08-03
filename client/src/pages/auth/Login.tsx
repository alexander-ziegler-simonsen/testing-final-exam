import LoginCompoent from "../../components/LoginCompoent";
import Navbar from "../../components/public/Navbar";
import { Link } from "react-router";

export default function Login() {
  return (
    <>
      <Navbar />
      <div data-testid="login-page">
        <p>this is login page</p>
        <p>this is the login component, right under here</p>

        <LoginCompoent />

        <br/>
        <hr/>

        <Link data-testid="login-dashboard-link" to="/app">
          dashboard
        </Link>


      </div>
    </>
  );
}
