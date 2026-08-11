'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Header = ({ categories, activeGid, initialQuery = '' }) => {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/?q=${encodeURIComponent(query)}`);
    setIsMenuOpen(false); // Close menu after searching on mobile
  };

  const closeMenu = () => setIsMenuOpen(false);

  const toggleSubMenu = (e, catName) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedMenus(prev => ({
      ...prev,
      [catName]: !prev[catName]
    }));
  };

  return (
    <header>
      <div className="header-container">
        <div className="logo-and-toggle">
          <div className="logo">
            🛍️ Affiliate<span>Mall</span>
          </div>
          <button 
            className="mobile-menu-toggle" 
            onClick={() => {
              if (!isMenuOpen) {
                setExpandedMenus({}); // Reset sub-menus when opening
              }
              setIsMenuOpen(!isMenuOpen);
            }}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>
        
        <div className={`nav-and-search ${isMenuOpen ? 'open' : ''}`}>
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-input-wrapper">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="text" 
                placeholder="ค้นหาสินค้าจากชื่อหรือเมนู..." 
                className="search-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </form>
          
          <nav className="main-nav">
            <ul>
              {categories && categories.map((cat) => (
                <li key={cat.name} className={cat.subCategories?.length > 0 ? 'has-dropdown' : ''}>
                  {cat.gid ? (
                    <div className="nav-item-wrapper">
                      <Link 
                        href={`/?gid=${cat.gid}`}
                        className={activeGid === cat.gid ? 'active' : ''}
                        onClick={() => { setQuery(''); closeMenu(); }}
                      >
                        {cat.name}
                      </Link>
                      {cat.subCategories?.length > 0 && (
                        <span 
                          className={`dropdown-toggle ${expandedMenus[cat.name] ? 'open' : ''}`}
                          onClick={(e) => toggleSubMenu(e, cat.name)}
                        >
                          ▼
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="nav-item-wrapper">
                      <span className="nav-group-title">
                        {cat.name}
                      </span>
                      {cat.subCategories?.length > 0 && (
                        <span 
                          className={`dropdown-toggle ${expandedMenus[cat.name] ? 'open' : ''}`}
                          onClick={(e) => toggleSubMenu(e, cat.name)}
                        >
                          ▼
                        </span>
                      )}
                    </div>
                  )}
                  
                  {cat.subCategories?.length > 0 && (
                    <ul className={`dropdown-menu ${expandedMenus[cat.name] ? 'open' : ''}`}>
                      {cat.subCategories.map(sub => (
                        <li key={sub.gid}>
                          <Link 
                            href={`/?gid=${sub.gid}`}
                            className={activeGid === sub.gid ? 'active' : ''}
                            onClick={() => { setQuery(''); closeMenu(); setExpandedMenus({}); }}
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="auth-buttons">
            <button className="btn btn-outline">เข้าสู่ระบบ</button>
            <button className="btn btn-primary">สมัครสมาชิก</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
