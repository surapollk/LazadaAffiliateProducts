import React from 'react';
import Link from 'next/link';

const Header = ({ categories, activeGid }) => {
  return (
    <header>
      <div className="header-container">
        <div className="logo">
          🛍️ Affiliate<span>Mall</span>
        </div>
        
        <nav className="main-nav">
          <ul>
            {categories && categories.map((cat) => (
              <li key={cat.gid}>
                <Link 
                  href={`/?gid=${cat.gid}`}
                  className={activeGid === cat.gid ? 'active' : ''}
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
