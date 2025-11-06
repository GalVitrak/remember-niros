import "./Layout.css";
import { Header } from "../Header/Header";
import Footer from "../Footer/Footer";

export function Layout(): React.ReactElement {
  return (
    <div className="Layout">
      <div className="header">
        <Header />
      </div>
      <div className="main">
        <h1>Main</h1>
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}
