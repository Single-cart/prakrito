import Image from "next/image";

import { styles } from "@/app/styles";
import { cn } from "@workspace/ui/lib/utils";

import { Facebook, Instagram, Mail, Phone, Youtube } from "lucide-react";
import Link from "next/link";
import Delivery from "../public/delivery-fast.png";
import Logo from "../public/logo.png";
import Payment from "../public/secure-payment.png";

const Footer = () => {
  return (
    <footer className="relative">
      {/* Service highlights section with improved alignment */}
      <div
        className={cn(
          styles.paddingX,
          "bg-gradient-to-r from-secondary/90 to-secondary py-10 flex justify-center items-center flex-wrap md:gap-16 gap-8"
        )}
      >
        <div className="flex items-center justify-center px-4 gap-4 transition-transform hover:scale-105 w-full max-w-xs">
          <div className="bg-white p-3 rounded-full shadow-md">
            <Image
              src={Delivery}
              alt="super fast delivery"
              width={50}
              height={50}
              className="object-contain"
            />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-xl">গ্রিন ডেলিভারি</h3>
            <p className="text-sm opacity-90">
              ৩-৫ দিনের মধ্যে আপনার পণ্য পৌছে যাবে
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center px-4 gap-4 transition-transform hover:scale-105 w-full max-w-xs">
          <div className="bg-white p-3 rounded-full shadow-md">
            <Image
              src={Payment}
              alt="secure payment"
              width={50}
              height={50}
              className="object-contain"
            />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-xl">নিরাপদ পেমেন্ট</h3>
            <p className="text-sm opacity-90">
              বিভিন্ন পেমেন্ট পদ্ধতি থেকে বেছে নিন
            </p>
          </div>
        </div>
      </div>

      {/* Main footer with fixed alignment */}
      <div className="bg-gradient-to-b from-[#1C4245] to-[#0d2527]">
        <div
          className={cn(
            "py-12 px-6 lg:px-10",
            styles.paddingX,
            "text-white grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-12 md:gap-x-8"
          )}
        >
          <div className="space-y-6 max-w-md">
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg inline-block">
              <Image
                src={Logo}
                alt="shop logo"
                width={100}
                height={100}
                className="transform hover:scale-105 transition-transform"
              />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed text-justify">
              At Prakrito.com, we strive to ensure your complete satisfaction
              with every purchase. If, for any reason, you are not entirely
              satisfied with your order due to receiving a broken or
              misrepresented product, we are here to assist you with our
              straightforward return policy.
            </p>
            <div className="flex items-center gap-3">
              <Link
                href={"https://www.facebook.com/prakrito0/"}
                target="_blank"
                className="hover:-translate-y-1 transition-transform"
              >
                <Facebook className="bg-[#275b5f] hover:bg-[#3a7c81] h-10 w-10 p-2 rounded-full transition-colors" />
              </Link>
              <Link
                href={"/"}
                className="hover:-translate-y-1 transition-transform"
              >
                <Youtube className="bg-[#275b5f] hover:bg-[#3a7c81] h-10 w-10 p-2 rounded-full transition-colors" />
              </Link>
              <Link
                href={"/"}
                className="hover:-translate-y-1 transition-transform"
              >
                <Instagram className="bg-[#275b5f] hover:bg-[#3a7c81] h-10 w-10 p-2 rounded-full transition-colors" />
              </Link>
              <Link
                href={"mailto:prakritofood@gmail.com"}
                className="hover:-translate-y-1 transition-transform"
              >
                <Mail className="bg-[#275b5f] hover:bg-[#3a7c81] h-10 w-10 p-2 rounded-full transition-colors" />
              </Link>
              <Link
                href={"tel:01606677285"}
                className="hover:-translate-y-1 transition-transform"
              >
                <Phone className="bg-[#275b5f] hover:bg-[#3a7c81] h-10 w-10 p-2 rounded-full transition-colors" />
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold pb-2 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-secondary">
              QUICK LINKS
            </h3>
            <div className="flex flex-col gap-3 pl-1">
              {["About Us", "Products", "Blogs", "FAQ"].map((item, i) => (
                <Link
                  key={i}
                  href={
                    item === "About Us"
                      ? "/about"
                      : item === "Products"
                        ? "/products"
                        : item === "Blogs"
                          ? "/blogs"
                          : item === "FAQ"
                            ? "/faq"
                            : "/"
                  }
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-secondary rounded-full group-hover:scale-150 transition-transform"></span>
                  {item}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold pb-2 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-secondary">
              OUR COMPANY
            </h3>
            <div className="flex flex-col gap-3 pl-1">
              {[
                { name: "Privacy Policy", link: "/policy" },
                { name: "Refund and Returns Policy", link: "/policy" },
                { name: "Customer Support", link: "/" },
                { name: "Report Bugs", link: "/" },
              ].map((item, i) => (
                <Link
                  key={i}
                  href={item.link}
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-secondary rounded-full group-hover:scale-150 transition-transform"></span>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold pb-2 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-secondary">
              CONTACT US
            </h3>
            <div className="flex flex-col gap-4 pl-1">
              <Link
                target="_blank"
                href="https://wa.me/+8801606677285?text=Can i make a order ?"
                className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors"
              >
                <div className="bg-[#275b5f] p-2 rounded-md flex-shrink-0">
                  <Phone size={16} />
                </div>
                <span>Whatsapp: +8801606677285</span>
              </Link>
              <Link
                href={"tel:+8801929185729"}
                className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors"
              >
                <div className="bg-[#275b5f] p-2 rounded-md flex-shrink-0">
                  <Phone size={16} />
                </div>
                <span>Phone: +8801606677285</span>
              </Link>
              <Link
                href={"mailto:prakritofood@gmail.com"}
                className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors"
              >
                <div className="bg-[#275b5f] p-2 rounded-md flex-shrink-0">
                  <Mail size={16} />
                </div>
                <span>Email: prakritofood@gmail.com</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright section with improved alignment */}
      <div className="font-medium text-sm flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-[#1a444a] to-[#275b5f] px-6 md:px-10 py-4 text-white mb-16 lg:mb-0">
        <span className="mb-2 md:mb-0">
          &copy; 2024 prakritofood. All rights reserved.
        </span>
        <span>
          Developed by{" "}
          <Link
            className="text-secondary hover:underline font-semibold"
            href={"https://github.com/TaifurIslamAshraf"}
            target="_blank"
          >
            MD. Taifur
          </Link>
        </span>
      </div>

      {/* Decorative wave svg */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-0 transform rotate-180">
        <svg
          className="relative block h-8 w-full"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-secondary/30"
          ></path>
        </svg>
      </div>
    </footer>
  );
};

export default Footer;
