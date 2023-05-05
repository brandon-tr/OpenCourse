import Link from "next/link";
import Image from "next/image";
import Avatar from "@/components/ui/Surfaces/Avatar";
import Badge from "@/components/ui/Surfaces/Badge";

interface AppBarProps {
  logoSrc?: string;
  logoAlt?: string;
  avatarSrc?: string;
  badgeText?: string;
  items: { title: string; link: string }[];
  roundedLogo?: boolean;
}

const AppBar: React.FC<AppBarProps> = ({
  logoSrc,
  logoAlt,
  avatarSrc,
  badgeText,
  items,
  roundedLogo = true,
}) => {
  return (
    <header className="bg-primary shadow-md">
      <div className="container  mx-auto px-4 py-2 flex flex-wrap items-center justify-between">
        {logoSrc && (
          <div
            className={`flex items-center ${
              roundedLogo ? "overflow-hidden" : ""
            }`}
          >
            <div className="relative w-16 h-16">
              <Image
                src={logoSrc}
                alt={logoAlt || "logo"}
                fill={true}
                style={{
                  objectFit: "contain",
                  borderRadius: `${roundedLogo ? "50%" : 0}`,
                }}
              />
            </div>
          </div>
        )}
        <nav className="flex items-center space-x-4">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className="hover:text-accent transition-colors duration-200"
            >
              {item.title}
            </Link>
          ))}
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
        </nav>
      </div>
    </header>
  );
};

export default AppBar;
