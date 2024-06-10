import React from 'react';
import vodafoneLogo from '../../Assets/vodafone_logo.png'; // Import the Vodafone logo
import './Navbar.css';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    const signingOut = () => {
        localStorage.clear();
        navigate('/login');
    };

    const qrScan = () => {
        navigate('/qrcode');
    };

    const logoClick = () => {
        navigate('/');
    };

    return (
        <div className='Navbar'>
            <div className='logo' onClick={logoClick}>
                <div className='logo-image'>
                    <img className='image' src={vodafoneLogo} alt='Vodafone Logo' /> {/* Use Vodafone logo */}
                </div>
                <div className='logo-head'>
                    <p>Vodacom</p>
                </div>
            </div>
            <div className='Nav-menu'>
                <div className='sign-out' style={{ order: '2' }} onClick={signingOut}>
                    <i className='fa fa-sign-out' aria-hidden='true' style={{ color: 'white', fontSize: '2.2em', cursor: 'pointer' }}></i>
                </div>
                <div className='qr-code' style={{ order: '1' }} onClick={qrScan}>
                    <i className='fa fa-qrcode' aria-hidden='true' style={{ color: 'white', fontSize: '2.2em', cursor: 'pointer' }}></i>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
