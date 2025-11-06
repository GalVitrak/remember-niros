import "./Footer.css";

function Footer(): React.ReactElement {
  return (
    <footer className="Footer">
      <div className="footer-container">
        <div className="footer-content">
          <p>יהי זכרו ברוך</p>
          <p className="credit-text">
            האתר נבנה בהתנדבות ע"י גל ויטרק
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
