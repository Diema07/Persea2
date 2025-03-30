import React from 'react';
import instagram from "../img/instagram.png"
import facebook from "../img/facebook.png"
import gmail from "../img/gmail.png"
import '../styles/footer.css'; // Importamos el CSS

export const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-left">
                    <h3 className="footer-title">Persea</h3>
                    <p className="footer-text">Diego Arevalo</p>
                    <p className="footer-text">Marisol Morales</p>
                    <p className="footer-text">Andrés Ramírez</p>
                </div>
                <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Persea. Todos los derechos reservados.</p>
            </div>
                
                <div className="footer-right">
                    <h3 className="footer-title">Redes Sociales</h3>
                    <div className="social-icons">
                    
                        <a href="#" className="social-icon" aria-label="Instagram">
                            <img src={instagram} alt="Instagram" width="24" height="24" />
                        </a>
                        <a href="#" className="social-icon" aria-label="Twitter">
                            <img src={facebook} alt="Twitter" width="24" height="24" />
                        </a>
                        <a href="#" className="social-icon" aria-label="Facebook">
                            <img src={gmail} alt="Facebook" width="24" height="24" />
                        </a>
                    </div>
                </div>
                
            </div>
            
         
        </footer>
    );
};

export default Footer;