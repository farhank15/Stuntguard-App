import Logo from "@assets/images/logos/stuntguard.svg";

const Footer = () => {
  return (
    <div>
      <footer className="p-10 bg-base-200 text-base-content">
        <div className="grid grid-cols-1 md:grid-cols-4 ">
          <aside className="md:col-span-1 mb-10 md:mb-0">
            <img className="w-24 mb-4" src={Logo} alt="stuntguard" />
            <p>
              ACME Industries Ltd.
              <br />
              Providing reliable tech since 1992
            </p>
          </aside>
          <div className="footer md:col-span-2 md:ml-32 grid grid-cols-2 gap-4 md:gap-0 md:grid-cols-3">
            <nav>
              <h6 className="footer-title">Services</h6>
              <a className="link link-hover">Branding</a>
              <a className="link link-hover">Design</a>
              <a className="link link-hover">Marketing</a>
              <a className="link link-hover">Advertisement</a>
            </nav>
            <nav>
              <h6 className="footer-title">Company</h6>
              <a className="link link-hover">About us</a>
              <a className="link link-hover">Contact</a>
              <a className="link link-hover">Jobs</a>
              <a className="link link-hover">Press kit</a>
            </nav>
            <nav>
              <h6 className="footer-title">Reference</h6>
              <a className="link link-hover" href="https://stunting.go.id/">
                Stunting
              </a>
            </nav>
            <nav>
              <h6 className="footer-title">Services</h6>
              <a className="link link-hover">Branding</a>
              <a className="link link-hover">Design</a>
              <a className="link link-hover">Marketing</a>
              <a className="link link-hover">Advertisement</a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
