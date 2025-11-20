import "./Layout.css";
import { Header } from "../Header/Header";
import Footer from "../Footer/Footer";
import { Routing } from "../Routing/Routing";

export function Layout(): React.ReactElement {
  return (
    <div className="Layout">
      <div className="header">
        <Header />
      </div>
      <div className="main">
        <Routing />
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}
