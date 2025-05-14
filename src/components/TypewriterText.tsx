import React, { useState, useEffect } from 'react';

interface TypewriterTextProps {
    text: string;
    className?: string;
    speed?: number;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({
    text,
    className = '',
    speed = 50
}) => {
    const [displayText, setDisplayText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, speed);

            return () => clearTimeout(timeout);
        }
    }, [currentIndex, text, speed]);

    return (
        <p className={className}>
            {displayText}
            <span className="animate-blink">|</span>
        </p>
    );
};

export default TypewriterText; 