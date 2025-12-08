import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './auth-interface/AuthContext';

function Card({name = "Unknown", ID = 0, school = "Unknown"}) {
    const { logout } = useContext(AuthContext)

    return (
        <div className="card">
            <img className='card-image' src="https://dummyimage.com/150/000/fff" alt="Profile picture"></img>
            <h2 className='card-title'>{name} - {ID}</h2>
            <p className='card-text'>Student at {school}</p>
            <br/>
            <button onClick={logout}>Đăng xuất</button><br/>
            
            <Link to="/cart">Giỏ hàng</Link>

        </div>
    );
}


export default Card