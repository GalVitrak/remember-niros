import "./Layout.css";
import { Header } from "../Header/Header";
import { HamburgerMenu } from "../HamburgerMenu/HamburgerMenu";
import Footer from "../Footer/Footer";
import { Routing } from "../Routing/Routing";
import { ScrollToTop } from "../ScrollToTop/ScrollToTop";

export function Layout(): React.ReactElement {
  return (
    <div className="Layout">
      <ScrollToTop />
      <div className="header">
        <Header />
      </div>
      <HamburgerMenu />
      <div className="main">
        <Routing />
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}
