import React from 'react';
import './Card.css';

interface CardProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
    subtitle?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className = '', subtitle }) => {
    return (
        <div className={`card ${className} fade-in`}>
            {(title || subtitle) && (
                <div className="card-header">
                    {title && <h3>{title}</h3>}
                    {subtitle && <p className="card-subtitle">{subtitle}</p>}
                </div>
            )}
            <div className="card-body">
                {children}
            </div>
        </div>
    );
};

export default Card;
