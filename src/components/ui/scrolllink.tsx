import { useNavigate } from "react-router-dom";

declare global {
    interface Window {
    scrollToSection?: string;
    }
}

interface ScrollLinkProps {
    to: string;
    sectionId: string;
    children: React.ReactNode;
    className?: string;
}

export default function ScrollLink({ to, sectionId, children, className }: ScrollLinkProps) {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
  e.preventDefault();

  if (window.location.pathname !== to) {
    window.scrollToSection = sectionId;
    navigate(to);
  } else {
    const el = document.getElementById(sectionId);
    console.log("Clicked section:", sectionId, "offsetTop:", el?.offsetTop, "boundingRect:", el?.getBoundingClientRect());
    if (el) {
      const yOffset = -80;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }
};

  return (
    <a href={`${to}#${sectionId}`} onClick={handleClick} className={`hover:text-foreground transition-colors ${className}`}>
      {children}
    </a>
  );


return (
    <a
    href={`${to}#${sectionId}`}
    onClick={handleClick}
    className={`hover:text-foreground transition-colors ${className}`}
    >
    {children}
    </a>
);
}
