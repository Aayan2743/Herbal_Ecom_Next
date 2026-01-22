import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Youtube, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-800 border-t">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {/* Brand & About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/logo.webp"
                alt="Sridevi Herbal and Co"
                width={50}
                height={50}
              />
              <h3 className="text-lg font-semibold">
                Sridevi Herbal and Co
              </h3>
            </div>

            <h4 className="font-semibold mb-2">About Us</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Hi, I am Vemula Sridevi I have done 2 years Ayurvedic
              diploma along with naturopathy course I am an expert in
              natural skin and hair care products I have trained...
            </p>

            <Link
              href="/about-us"
              className="inline-block mt-2 text-sm font-medium text-green-700 hover:underline"
            >
              View More
            </Link>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Home</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/" className="hover:text-green-700">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-green-700">
                  Shop &nbsp; &gt;
                </Link>
              </li>
              <li>
                <Link
                  href="/bath-powder-story"
                  className="hover:text-green-700"
                >
                  Bath Powder Story
                </Link>
              </li>
              <li>
                <Link
                  href="/social-media"
                  className="hover:text-green-700"
                >
                  Social Media
                </Link>
              </li>
              <li>
                <Link
                  href="/success-story"
                  className="hover:text-green-700"
                >
                  Success Story
                </Link>
              </li>
              <li>
                <Link href="/more" className="hover:text-green-700">
                  More &nbsp; &gt;
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-green-700">
                  Login
                </Link>
              </li>
            </ul>

            <div className="mt-4 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                ✉️ herbalandco@gmail.com
              </p>
              <p className="flex items-center gap-2 mt-1">
                📞 8919105591
              </p>
            </div>
          </div>

          {/* Address */}
          <div>
            <h4 className="font-semibold mb-4">Visit Us</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Peerzadiguda, Uppal,
              <br />
              Hyderabad, Telangana,
              <br />
              500098
            </p>
          </div>

          {/* Social Icons */}
          <div>
            <h4 className="font-semibold mb-4">Follow us here</h4>
            <div className="flex gap-4">
              <a href="#" aria-label="Facebook">
                <Facebook className="w-6 h-6 text-blue-600" />
              </a>
              <a href="#" aria-label="Instagram">
                <Instagram className="w-6 h-6 text-pink-500" />
              </a>
              <a href="#" aria-label="YouTube">
                <Youtube className="w-6 h-6 text-red-600" />
              </a>
              <a href="#" aria-label="WhatsApp">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Sridevi Herbal and Co. All rights reserved.
      </div>
    </footer>
  );
}
