import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import {
  FOOTER_LINK_GROUPS,
  CONTACT_INFO,
  SOCIAL_LINKS,
  FOOTER_DESCRIPTION,
  FOOTER_TAGLINE,
  FOOTER_COPYRIGHT,
} from "@/constants/footer.constants";
import { Mail, MapPin, Phone } from "lucide-react";

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  facebook: <FaFacebookF size={16} />,
  instagram: <FaInstagram size={16} />,
  tiktok: <FaTiktok size={16} />,
};

export default function Footer() {
  return (
    <footer className=" text-white relative overflow-hidden">
      <div className="w-full">
        <Image
          src="/footer/footer.svg"
          alt="Nepal skyline"
          width={1440}
          height={300}
          className="w-full h-auto object-cover object-bottom"
          priority
        />
      </div>

      <div className="max-w-screen bg-[#2A2A2A]">
        <div className="max-w-7xl  mx-auto px-6 lg:px-8 pt-10 pb-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="flex flex-col gap-4">
              <Link href="/">
                <Image
                  src="/footer/footerlogo.svg"
                  alt="Popular Rides Logo"
                  width={80}
                  height={70}
                />
              </Link>
              <p className="text-[16px] text-[#ffffff] font-poppins leading-relaxed max-w-xs">
                {FOOTER_DESCRIPTION}
              </p>
              <div className="flex gap-1 items-center ">
                <p className="text-[16px] font-bold text-white font-poppins">
                  Follow Us:
                </p>
                <div className="flex items-center gap-3">
                  {SOCIAL_LINKS.map((s) => (
                    <Link
                      key={s.id}
                      href={s.href}
                      aria-label={s.label}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-white hover:bg-[#FEA800] transition-colors flex items-center justify-center text-[#000000]/80 hover:text-white"
                    >
                      {SOCIAL_ICONS[s.icon]}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-15">
              {FOOTER_LINK_GROUPS.map((group) => (
                <div key={group.title} className="flex flex-col gap-2">
                  <h3 className="text-[24px] font-semibold text-white font-poppins">
                    {group.title}
                  </h3>
                  <ul className="flex flex-col gap-3">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-[16px] text-[#ffffff] font-poppins hover:text-[#FEA800] transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <div className="flex flex-col gap-4">
                <h3 className="text-[24px] font-semibold text-white font-poppins">
                  Contact Us
                </h3>
                <ul className="flex flex-col gap-4">
                  <li className="flex items-start gap-3">
                    <MapPin
                      size={18}
                      className="text-[#ffffff] shrink-0 mt-0.5"
                    />
                    <span className="text-[16px] text-[#ffffff] font-poppins leading-relaxed">
                      {CONTACT_INFO.address}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Phone
                      size={18}
                      className="text-[#ffffff] shrink-0 mt-0.5"
                    />

                    <div className="flex flex-col gap-1">
                      {CONTACT_INFO.phones.map((phone) => (
                        <Link
                          key={phone}
                          href={`tel:${phone}`}
                          className="text-[16px] text-[#ffffff] font-poppins hover:text-[#FEA800] transition-colors"
                        >
                          {phone}
                        </Link>
                      ))}
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Mail
                      size={18}
                      className="text-[#ffffff] shrink-0 mt-0.5"
                    />

                    <Link
                      href={`mailto:${CONTACT_INFO.email}`}
                      className="text-[16px] text-[#ffffff] font-poppins hover:text-[#FEA800] transition-colors break-all"
                    >
                      {CONTACT_INFO.email}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-10 relative flex max-w-7xl w-full px-6 lg:px-0">
            <p className="text-[80px] sm:text-[90px] lg:text-[130px] font-extrabold font-luckiest-guy text-[#ffffff]/10 leading-none tracking-wider select-none uppercase">
              {FOOTER_TAGLINE}
            </p>
          </div>

          <div className="mt-4 border-t border-white/50 pt-5 flex items-center justify-center gap-2">
            <p className="text-[#FFFFFF] text-[16px] font-poppins">
              {FOOTER_COPYRIGHT}
            </p>
            <Link href={"https://voidnepal.com.np/"}>
              <Image
                src="/footer/void.svg"
                alt="Void NP"
                width={56}
                height={40}
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
