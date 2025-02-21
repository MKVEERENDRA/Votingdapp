import React, { useState } from 'react';
import Style from './them.module.css'; // Ensure your CSS is imported

const ThemeSwitcher = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [theme, setTheme] = useState('default-theme'); // Ensure default theme is set properly

    const switchTheme = (themeName) => {
        document.documentElement.className = themeName;
        setTheme(themeName);
        setIsOpen(false);
    };

    return (
        <div>
            <button
                className={Style['theme-switcher-btn']}
                onClick={() => setIsOpen(!isOpen)}
            >
                ☰
            </button>
            <div className={`${Style['theme-options']} ${isOpen ? Style['show'] : ''}`}>
                <button className={Style['royal-gold-theme-btn']} onClick={() => switchTheme('royal-gold-theme')}>Royal Gold</button>
                <button className={Style['default-theme-btn']} onClick={() => switchTheme('default-theme')}>Default Theme</button>
                <button className={Style['dark-mode-btn']} onClick={() => switchTheme('dark-mode')}>Dark Mode</button>
                <button className={Style['neon-glow-btn']} onClick={() => switchTheme('neon-glow')}>Neon Glow</button>
                <button className={Style['pastel-palette-btn']} onClick={() => switchTheme('pastel-palette')}>Pastel Palette</button>
                <button className={Style['midnight-blue-theme-btn']} onClick={() => switchTheme('midnight-blue-theme')}>Midnight Blue</button>
                <button className={Style['emerald-green-theme-btn']} onClick={() => switchTheme('emerald-green-theme')}>Emerald Green</button>
                <button className={Style['crimson-velvet-theme-btn']} onClick={() => switchTheme('crimson-velvet-theme')}>Crimson Velvet</button>
                <button className={Style['silver-sapphire-theme-btn']} onClick={() => switchTheme('silver-sapphire-theme')}>Silver & Sapphire</button>
                <button className={Style['obsidian-amber-theme-btn']} onClick={() => switchTheme('obsidian-amber-theme')}>Obsidian & Amber</button>
                <button className={Style['platinum-ruby-theme-btn']} onClick={() => switchTheme('platinum-ruby-theme')}>Platinum & Ruby</button>
            </div>
        </div>
    );
};

export default ThemeSwitcher;