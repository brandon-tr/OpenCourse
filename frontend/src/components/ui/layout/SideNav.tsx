"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import useWindowSize from "@/components/hooks/UseWindowSize";
import { useUiStore } from "@/components/store/Store";
import HorizontalLine from "@/components/ui/Surfaces/HorizontalLine";
import useClickOutside from "@/components/hooks/UseClickOutside";
import getClassNames from "@/components/utility/GetClassNames";
import { usePathname } from "next/navigation";

interface SideNavProps {
  items: { title: string; link: string; category: string; visible: boolean }[];
  children: React.ReactNode;
  isMobile?: boolean;
  opacity?: number;
}

const SideNav: React.FC<SideNavProps> = ({
  items,
  children,
  isMobile = false,
  opacity = 85,
}) => {
  const pathName = usePathname();
  const appBarHeight = useUiStore((state) => state.appBarHeight);
  const navWidth = "16";
  const { width } = useWindowSize();
  const sideNavRef = useRef<HTMLDivElement>(null);
  const isOpen = useUiStore((state) => state.isSideNavOpen);
  const setIsOpen = useUiStore((state) => state.setIsSideNavOpen);
  const mobileBreakpoint = 768;

  const [isScrolled, setIsScrolled] = useState(false); // New state to handle scrolled status

  useClickOutside(sideNavRef, (e: MouseEvent | TouchEvent) => {
    if (e.target instanceof HTMLElement && e.target.id !== "hamburger") {
      setIsOpen(false);
    }
  });

  const shouldShowNav = () => {
    if (isMobile || (width && width <= mobileBreakpoint)) {
      return isOpen;
    }
    return true;
  };

  // effect to listen to scroll events
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      setIsScrolled(isScrolled);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Group links by category
  const linksByCategory = useMemo(() => {
    const result: {
      [category: string]: { title: string; link: string; visible: boolean }[];
    } = {};

    items.forEach((item) => {
      if (item.category in result) {
        result[item.category].push({
          title: item.title,
          link: item.link,
          visible: item.visible,
        });
      } else {
        result[item.category] = [
          { title: item.title, link: item.link, visible: item.visible },
        ];
      }
    });

    return result;
  }, [items]);
  return (
    <div className="flex">
      <div
        ref={sideNavRef}
        className={getClassNames(
          "fixed top-14 left-0 h-full z-10 bg-primary w-64 transition-all duration-300 ease-in-out transform",
          !shouldShowNav() && "translate-x-full pointer-events-none"
        )}
        style={{
          top: isScrolled ? 0 : appBarHeight, // Change top value based on isScrolled state
          opacity: !shouldShowNav() ? 0 : opacity / 100,
        }}
      >
        <nav className="flex flex-col pt-4 px-4 space-y-4">
          {Object.entries(linksByCategory).map(([category, links], index) => (
            <div key={category} className="space-y-2 mb-2">
              <h3 className="text-white font-bold uppercase">{category}</h3>
              {links.map(
                (link, index) =>
                  link.visible && (
                    <div key={index}>
                      <Link
                        href={link.link}
                        className={`test3 hover:text-accent transition-colors duration-200 block ${
                          pathName === link.link ? "text-accent" : ""
                        }`}
                      >
                        {link.title}
                      </Link>
                    </div>
                  )
              )}
              {index !== Object.entries(linksByCategory).length - 1 && (
                <div className="mt-2">
                  <HorizontalLine />
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
      <div
        className="w-full box-content"
        style={{
          paddingLeft: width && width > mobileBreakpoint ? navWidth + "rem" : 0,
          filter:
            width && width <= mobileBreakpoint && isOpen ? "blur(5px)" : "none",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default SideNav;
