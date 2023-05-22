import Footer from "./Footer";
import Navigation from "./Navigation";

function Layout({ children }) {
  return (
    <div className="font-poppins">
      <header className="shadow-md px-2 lg:px-16">
        <Navigation />
      </header>
      <main className="px-2 lg:px-16">{children}</main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
export default Layout;