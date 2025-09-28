import React from 'react';
import './style.scss'
import clsx from 'clsx';
import { Container } from '../Container';
import logoImg from '../../assets/images/logo.svg'
import afltLogo from '../../assets/images/aflt.svg'

interface Props {
    className?: string;
}

export const Footer: React.FC<Props> = ({ className }) => {
    return (
        <footer className={clsx('footer', className)}>
            <Container fluid>
                <div className="footer-names">
                    <div className='footer-title'>Разработчики <span className='footer-team'>404Found</span></div>
                    <ul className="footer-names__list">
                        <li className="footer-names__item">Бабка Артём</li>
                        <li className="footer-names__item">Горчуков Денис</li>
                        <li className="footer-names__item">Ермолин Владислав</li>
                        <li className="footer-names__item">Жердева Валентина</li>
                        <li className="footer-names__item">Попова Екатерина</li>
                    </ul>
                </div>

                <div className="footer-logos">
                    <img src={afltLogo} className='footer-logo' alt="АФЛТ Системс" />
                    <img src={logoImg} className='footer-logo footer-logo--404' alt="404Found МГТУ ГА" />
                </div>



            </Container>
        </footer>
    );
};