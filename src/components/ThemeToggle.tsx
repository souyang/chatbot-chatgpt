import React, { useEffect, useState } from "react";

export default function ThemeToggle() {
    const [theme, setTheme] = useState('dark');
    const toggleTheme = () => {
      setTheme(theme === 'dark' ? 'light' : 'dark');
    };
    // initially set the theme and "listen" for changes to apply them to the HTML tag
    useEffect(() => {
      if (window != null && window.document.querySelector('html')) {
        window.document.querySelector('html')?.setAttribute('data-theme', theme);
      }
    }, [theme]);
    return (
    <>
      <label className="swap swap-rotate">
        <input onChange={toggleTheme} type="checkbox"/>
        <div className="swap-on">Dark Mode</div>
        <div className="swap-off">Light Mode</div>
      </label>
    </>
    );
  }