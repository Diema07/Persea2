import React from 'react';
import instagram from "../img/instagram.png"
import facebook from "../img/facebook.png"
import gmail from "../img/gmail.png"
import '../styles/footer.css';

export const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p className="footer-text">Diego Arevalo - Marisol Morales - Andrés Ramírez</p>
                <p className="footer-copyright">&copy; {new Date().getFullYear()} Persea. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
};

export default Footer;