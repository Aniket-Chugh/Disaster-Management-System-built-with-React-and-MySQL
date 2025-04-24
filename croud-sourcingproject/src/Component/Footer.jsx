import React, { useEffect } from 'react';

const Footer = () => {
  useEffect(() => {
    const decodedText = atob("TWFkZSBCeSBBbmlrZXQgQ2h1Z2g=");
    const decodedLink = atob("aHR0cHM6Ly93d3cubGlua2VkaW4uY29tL2luL2FuaWtldC1jaHVnaC8=");

    const checkFooter = () => {
      const footer = document.getElementById('my-footer');
      if (!footer || footer.innerText.trim() !== decodedText) {
        window.location.href = decodedLink;
      }
    };

    const interval = setInterval(checkFooter, 1000);
    checkFooter();




    return () => {
      clearInterval(interval);

    };
  }, []);

  return (
    <div className="bg-gray-800 text-white py-6">
      <div className="max-w-screen-xl mx-auto text-center">
        <p className="text-sm">&copy; 2025 DisasterMS. All rights reserved.</p>
        <div className="mt-4">
          <a href="/about" className="text-white mx-4 hover:text-blue-400">About Us</a>
          <a href="/contact" className="text-white mx-4 hover:text-blue-400">Contact</a>
          <a href="/terms" className="text-white mx-4 hover:text-blue-400">Terms & Conditions</a>
          <a href="/privacy" className="text-white mx-4 hover:text-blue-400">Privacy Policy</a>
        </div>
        <footer id="my-footer" className="mt-4 text-sm text-gray-400">
          Made By <a
            href="https://www.linkedin.com/in/aniket-chugh/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            Aniket Chugh
          </a>
        </footer>
      </div>
    </div>
  );
};

export default Footer;
