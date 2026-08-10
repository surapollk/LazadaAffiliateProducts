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
          <ul>
            {categories && categories.map((cat) => (
              <li key={cat.gid}>
                <Link href={`/?gid=${cat.gid}`}>
                  {cat.name}
                </Link>
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
