'use client';
import React, { useState } from 'react';
import Link from 'next/link';

const Footer = ({ categories }) => {
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleSubMenu = (e, catName) => {
    e.preventDefault();
    setExpandedMenus(prev => ({
      ...prev,
      [catName]: !prev[catName]
    }));
  };

  return (
    <footer>
      <div className="footer-content">
        <div className="footer-col">
          <h3>เกี่ยวกับเรา</h3>
          <p>
            เว็บไซต์รวบรวมสินค้าคุณภาพ โปรโมชั่นพิเศษ และดีลเด็ดๆ จากพาร์ทเนอร์ชั้นนำ
            เพื่อคุณโดยเฉพาะ
          </p>
        </div>
        
        <div className="footer-col">
          <h3>หมวดหมู่สินค้า</h3>
          <ul className="footer-menu">
            {categories && categories.map((cat) => (
              <li key={cat.name} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {cat.gid ? (
                    <Link href={`/?gid=${cat.gid}`} style={{ fontWeight: '500', color: '#f36f21', marginRight: '8px' }}>
                      {cat.name}
                    </Link>
                  ) : (
                    <span style={{ fontWeight: '500', color: '#f36f21', marginRight: '8px' }}>{cat.name}</span>
                  )}
                  {cat.subCategories?.length > 0 && (
                    <span 
                      className={`footer-dropdown-toggle ${expandedMenus[cat.name] ? 'open' : ''}`}
                      onClick={(e) => toggleSubMenu(e, cat.name)}
                    >
                      ▼
                    </span>
                  )}
                </div>
                
                {cat.subCategories?.length > 0 && (
                  <ul className={`footer-sub-menu ${expandedMenus[cat.name] ? 'open' : ''}`} style={{ paddingLeft: '15px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {cat.subCategories.map(sub => (
                      <li key={sub.gid}>
                        <Link href={`/?gid=${sub.gid}`} style={{ color: '#ccc', fontSize: '0.9em' }}>
                          - {sub.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="footer-col">
          <h3>ศูนย์ช่วยเหลือ</h3>
          <ul>
            <li><a href="#">ติดต่อเรา</a></li>
            <li><a href="#">คำถามที่พบบ่อย</a></li>
            <li><a href="#">นโยบายความเป็นส่วนตัว</a></li>
            <li><a href="#">เงื่อนไขการใช้งาน</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} AffiliateMall. สงวนลิขสิทธิ์. (Disclaimer: This is an affiliate site)
      </div>
    </footer>
  );
};

export default Footer;
