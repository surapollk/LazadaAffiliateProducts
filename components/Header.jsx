'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Header = ({ categories, activeGid, initialQuery = '' }) => {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/?gid=${activeGid}&q=${encodeURIComponent(query)}`);
  };

  return (
    <header>
      <div className="header-container">
        <div className="logo">
          🛍️ Affiliate<span>Mall</span>
        </div>
        
        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-input-wrapper">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder="ค้นหาสินค้า..." 
              className="search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </form>
        
        <nav className="main-nav">
          <ul>
            {categories && categories.map((cat) => (
              <li key={cat.gid}>
                <Link 
                  href={`/?gid=${cat.gid}`}
                  className={activeGid === cat.gid ? 'active' : ''}
                  onClick={() => setQuery('')} // Clear search when changing category
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="auth-buttons">
          <button className="btn btn-outline">เข้าสู่ระบบ</button>
          <button className="btn btn-primary">สมัครสมาชิก</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
