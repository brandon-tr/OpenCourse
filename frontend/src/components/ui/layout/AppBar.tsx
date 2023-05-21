"use client";
import Link from "next/link";
import Image from "next/image";
import Avatar from "@/components/ui/Surfaces/Avatar";
import Badge from "@/components/ui/Surfaces/Badge";
import useResizeObserver from "@/components/hooks/UseResizeObserver";
import { useUiStore } from "@/components/store/Store";
import React, { useCallback, useEffect } from "react";
import useWindowSize from "@/components/hooks/UseWindowSize";
import { usePathname } from "next/navigation";
import { useLocalStorage } from "@/components/hooks/UseLocalStorage";

type WithLogoSrc = {
  isLogoText: false;
  logoSrc: string;
  logoText?: never;
};

type WithLogoText = {
  isLogoText: true;
  logoText: string;
  logoSrc?: never;
};

type LogoProps = WithLogoSrc | WithLogoText;

type AppBarProps = LogoProps & {
  logoAlt?: string;
  avatarSrc?: string;
  badgeText?: string;
  roundedLogo?: boolean;
  isMobile?: boolean;
};

const AppBar: React.FC<AppBarProps> = ({
  isLogoText,
  logoSrc,
  logoText,
  logoAlt,
  avatarSrc,
  badgeText,
  roundedLogo = true,
  isMobile = false,
}) => {
  const pathName = usePathname();
  const [storedValue, setStoredValue] = useLocalStorage("user", {
    level: 0,
    loggedIn: false,
  });
  const { ref, height } = useResizeObserver();
  const setAppBarHeight = useUiStore((state) => state.setAppBarHeight);
  const setIsSideNavOpen = useUiStore((state) => state.setIsSideNavOpen);
  const isSideNavOpen = useUiStore((state) => state.isSideNavOpen);
  const { width } = useWindowSize();
  const user = useUiStore((state) => state.user);
  const setUser = useUiStore((state) => state.setUser);

  const items = [
    {
      title: "Home",
      link: "/",
      visible: true,
    },
    { title: "FAQ", link: "/faq", visible: true },
    { title: "Register", link: "/register", visible: !user.loggedIn },
    { title: "Login", link: "/login", visible: !user.loggedIn },
    {
      title: "Dashboard",
      link: "/dashboard",
      visible: user.loggedIn && user.level > 1,
    },
  ];

  useEffect(() => {
    if (storedValue.loggedIn) {
      setUser(storedValue);
    }
  }, [setUser, storedValue, user]);

  useEffect(() => {
    if (height !== null) {
      setAppBarHeight(height);
    }
  }, [height, setAppBarHeight]);

  const handleHamburgerClick = useCallback(() => {
    setIsSideNavOpen(!isSideNavOpen);
  }, [isSideNavOpen, setIsSideNavOpen]);

  return (
    <header ref={ref} className="bg-primary shadow-md z-100 w-full">
      <div className="mx-auto px-4 py-2 flex justify-between items-center">
        {isMobile || (width && width <= 768)
          ? pathName.includes("dashboard") && (
              <button
                className="hamburger"
                onClick={handleHamburgerClick}
                id={"hamburger"}
              >
                <span className="hamburger-bar" id={"hamburger"} />
                <span className="hamburger-bar" id={"hamburger"} />
                <span className="hamburger-bar" id={"hamburger"} />
              </button>
            )
          : (logoSrc || logoText) && (
              <div className={`${roundedLogo ? "overflow-hidden" : ""} `}>
                {isLogoText ? (
                  <div className="relative">
                    <h1 className="text-2xl font-bold">{logoText}</h1>
                  </div>
                ) : (
                  <div className="relative w-16 h-16">
                    <Image
                      src={logoSrc!}
                      alt={logoAlt || "logo"}
                      fill={true}
                      style={{
                        objectFit: "contain",
                        borderRadius: `${roundedLogo ? "50%" : 0}`,
                      }}
                    />
                  </div>
                )}
              </div>
            )}
        <div
          className={`flex ${
            isMobile || (width && width <= 768)
              ? "w-screen justify-between"
              : "items-center"
          }`}
        >
          <nav className="flex items-center space-x-4 ml-4">
            {items.map(
              (item, index) =>
                item.visible && (
                  <Link
                    key={index}
                    href={item.link}
                    className="hover:text-accent transition-colors duration-200"
                  >
                    {item.title}
                  </Link>
                )
            )}
          </nav>
          {avatarSrc && (
            <div className="ml-4">
              {badgeText ? (
                <Badge text={badgeText} position="bottom-right" color="danger">
                  <Avatar src={avatarSrc} alt="User Avatar" size="small" />
                </Badge>
              ) : (
                <Avatar src={avatarSrc} alt="User Avatar" size="small" />
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppBar;
