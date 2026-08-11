import React from 'react';
import Link from 'next/link';

const Footer = ({ categories }) => {
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
                {cat.gid ? (
                  <Link href={`/?gid=${cat.gid}`} style={{ fontWeight: '500', color: '#f36f21' }}>
                    {cat.name}
                  </Link>
                ) : (
                  <span style={{ fontWeight: '500', color: '#f36f21' }}>{cat.name}</span>
                )}
                
                {cat.subCategories?.length > 0 && (
                  <ul style={{ paddingLeft: '15px', marginTop: '5px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
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
