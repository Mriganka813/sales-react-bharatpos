import { Link, useNavigate } from "react-router-dom";
import '../styles/home.scss'
import { FcSalesPerformance } from "react-icons/fc";
import { FaUsers } from "react-icons/fa";
import Cookies from "js-cookie";

const Home = () => {

    const navigate = useNavigate();

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
                    <FcSalesPerformance /> Manage Sales
                </Link>
                <Link to='/subusers-all'>
                    <FaUsers /> Manage Subusers
                </Link>
            </div>
        </div>
    )
};

export default Home;
