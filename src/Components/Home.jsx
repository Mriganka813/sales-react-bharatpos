import { Link, useNavigate } from "react-router-dom";
import '../styles/home.scss'
import Cookies from "js-cookie";
import { useEffect } from "react";

const Home = () => {

    const navigate = useNavigate();
    const token = Cookies.get('token');

    useEffect(() => {
        if (!token) {
            navigate("/login")
        }
    }, [navigate, token]);

    const handleLogout = () => {
        Cookies.remove('token');
        navigate("/login")
    }

    return (
        <div className="home-container">
            <div className="logout">
                <button onClick={handleLogout}>
                    Logout
                </button>
            </div>
            <div className="link-cont">
                <Link to='/sales-all'>
                    Manage Sales
                </Link>
                <Link to='/subusers-all'>
                    Manage Staff
                </Link>
                <Link to='/delete/me'>
                    Delete Account
                </Link>
            </div>
        </div>
    )
};

export default Home;
