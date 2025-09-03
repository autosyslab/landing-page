import { Facebook, Instagram, Linkedin, Twitter, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center space-y-4">
          {/* Social Links */}
          <nav className="flex items-center space-x-6" role="navigation" aria-label="Social media links">
            <a
              href="https://www.facebook.com/profile.php?id=61567540531709&locale=ro_RO"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-md p-1"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="https://www.instagram.com/autosyslab11/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-md p-1"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/company/autosyslab/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-md p-1"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://x.com/autosyslab"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-md p-1"
              aria-label="X (Twitter)"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="https://autosyslab.gumroad.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-md p-1"
              aria-label="Gumroad Store"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          </nav>

          {/* Copyright */}
          <div className="text-slate-500 text-sm" role="contentinfo">
            © 2025 AutoSys Lab. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}