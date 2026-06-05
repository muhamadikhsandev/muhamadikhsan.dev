"use client";
import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById("home");
      if (!heroSection) return;
      setVisible(window.scrollY > heroSection.offsetHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-blue-600/10 backdrop-blur-md text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.2)] border border-blue-500/20 transition-all duration-300 hover:scale-110 hover:bg-blue-600 hover:text-white hover:shadow-[0_0_28px_rgba(59,130,246,0.55)] hover:border-blue-500/40 active:scale-95 ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      aria-label="Back to top"
    >
      <ArrowUp size={22} strokeWidth={2.5} />
    </button>
  );
};

export default BackToTop;