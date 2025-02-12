import Image from "next/image";

import { styles } from "@/app/styles";
import { cn } from "@workspace/ui/lib/utils";

import { Facebook, Mail, Phone, Youtube } from "lucide-react";
import Link from "next/link";
import Delivery from "../public/delivery-fast.png";
import Logo from "../public/logo.png";
import Payment from "../public/secure-payment.png";

const Footer = () => {
  return (
    <>
      <div
        className={cn(
          styles.paddingX,
          "bg-secondary justify-evenly py-6 flex items-center flex-wrap gap-20 md:gap-6"
        )}
      >
        <div className="flex items-center justify-center px-2 gap-3">
          <Image
            src={Delivery}
            alt="super fast delivery"
            width={60}
            height={60}
          />
          <div className="space-y-2">
            <h1 className="font-semibold text-xl">গ্রিন ডেলিভারি</h1>
            <p>৩-৫ দিনের মধ্যে আপনার পণ্য পৌছে যাবে</p>
          </div>
        </div>
        <div className="flex items-center justify-center px-2 gap-3">
          <Image
            src={Payment}
            alt="super fast delivery"
            width={60}
            height={60}
          />
          <div className="space-y-2">
            <h1 className="font-semibold text-xl">নিরাপদ পেমেন্ট</h1>
            <p>বিভিন্ন পেমেন্ট পদ্ধতি থেকে বেছে নিন</p>
          </div>
        </div>
      </div>

      <div className="">
        <div
          className={cn(
            "p-8",
            styles.paddingX,
            "bg-[#1C4245] text-secondary grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-between gap-10"
          )}
        >
          <div className="space-y-4">
            <div className="">
              <Image src={Logo} alt="shop logo" width={100} height={100} />
            </div>
            <p className="text-[#cfc6c6] text-justify">
              At Fablura, we prioritize customer satisfaction and strive to
              ensure that your shopping experience with us is seamless. If you
              are not completely satisfied with your purchase, we’re here to
              help with an easy return and exchange process.
            </p>
            <div className="flex items-center gap-4">
              <Link href={"https://www.facebook.com/fablura0/"} target="_blank">
                <Facebook className="border border-secondary h-[45px] p-2 w-[45px] rounded-full" />
              </Link>

              <Link href={"/"}>
                <Youtube className="border border-secondary h-[45px] p-2 w-[45px] rounded-full" />
              </Link>

              <Link href={"mailto:fablurabd@gmail.com"}>
                <Mail className="border border-secondary h-[45px] p-2 w-[45px] rounded-full" />
              </Link>

              <Link href={"tel:+8801929185729"}>
                <Phone className="border border-secondary h-[45px] p-2 w-[45px] rounded-full" />
              </Link>
            </div>
          </div>

          <div className="text-[#cfc6c6] space-y-2 md:space-y-8">
            <h1 className="text-secondary text-xl font-semibold">
              QUICK LINKS
            </h1>
            <div className="flex flex-col gap-2">
              <Link href={"/about"}>About Us</Link>
              <Link href={"/"}>Products</Link>
              <Link href={"/"}>Blogs</Link>
              <Link href={"/"}>FAQ</Link>
            </div>
          </div>

          <div className="text-[#cfc6c6] space-y-2 md:space-y-8">
            <h1 className="text-secondary text-xl font-semibold">
              OUR COMPANY
            </h1>
            <div className="flex flex-col gap-2">
              <Link href={"/policy"}>Privacy Policy</Link>
              <Link href={"/policy"}>Refund and Returns Policy</Link>
              <Link href={"/"}>Customer Support</Link>
              <Link href={"/"}>Report Bugs</Link>
            </div>
          </div>

          <div className="text-[#cfc6c6] space-y-2 md:space-y-8">
            <h1 className="text-secondary text-xl font-semibold">CONTACT US</h1>
            <div className="flex flex-col gap-2">
              <Link
                target="_blank"
                href="https://wa.me/+8801929185729?text=Can i make a order ?"
              >
                Whatsapp: +8801929185729
              </Link>
              <Link href={"tel:+8801929185729"}>Phone: +8801929185729</Link>
              <Link href={"mailto:fablurabd@gmail.com"}>
                Email: fablurabd@gmail.com
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="font-semibold text-sm flex items-center justify-between bg-[#275b5f] px-10 py-3 text-white">
        <span>&copy; 2024 fablurabd</span>
        <span>
          develop by{" "}
          <Link
            className="text-blue-400 underline"
            href={"https://github.com/TaifurIslamAshraf"}
          >
            MD. Taifur
          </Link>
        </span>
      </div>
    </>
  );
};

export default Footer;
