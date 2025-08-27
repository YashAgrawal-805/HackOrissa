import React from "react";

const HeroAnimation = ({ theme }) => {
  // theme is "dark" for dark mode, anything else for light mode
  const isDark = theme === "dark";

  const cardData = [
    {
      name: "Gretel-ACTGAN",
      description: "Model for generating highly dimensional, mostly numeric, tabular data"
    },
    {
      name: "Claude-4-Sonnet", 
      description: "Advanced AI model for complex reasoning and creative tasks"
    },
    {
      name: "GPT-4-Turbo",
      description: "High-performance language model for diverse applications"
    },
    {
      name: "Gemini-Pro",
      description: "Multimodal AI model for text, image, and code generation"
    },
    {
      name: "LLaMA-2",
      description: "Open-source large language model for research and development"
    },
    {
      name: "PaLM-2",
      description: "Advanced language model with improved reasoning capabilities"
    }
  ];

  return (
    <div 
      className="w-full max-w-4xl mx-auto relative"
      style={{ 
        aspectRatio: "1 / 1",
        backgroundColor: isDark ? "#000000" : "transparent"
      }}
    >
      <div 
        className="absolute inset-0"
        style={{
          WebkitMaskImage: "linear-gradient(90deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 1))"
        }}
      >
        <ul 
          className="list-none m-0 p-0 relative w-full h-full z-10"
          style={{ 
            aspectRatio: "1 / 1",
            outline: isDark ? "2px dotted #444" : "2px dotted magenta"
          }}
          onMouseEnter={(e) => {
            const animations = e.currentTarget.querySelectorAll('.rotating-item, .rotating-card');
            animations.forEach(el => el.style.animationPlayState = 'paused');
          }}
          onMouseLeave={(e) => {
            const animations = e.currentTarget.querySelectorAll('.rotating-item, .rotating-card');
            animations.forEach(el => el.style.animationPlayState = 'running');
          }}
        >
          {cardData.map((card, index) => (
            <li
              key={index}
              className="absolute top-1/2 w-full rotating-item"
              style={{
                transform: "translateY(-50%)",
                animation: "rotateCW 40s cubic-bezier(0.000, 0.37, 1.000, 0.63) infinite",
                animationDelay: `${-40/6 * index}s`
              }}
            >
              <div
                className="flex flex-col items-start gap-2 font-sans text-sm leading-5 rotating-card"
                style={{
                  width: "27%",
                  padding: "16px 24px",
                  background: isDark ? "#1a1a1a" : "#FFFFFF",
                  color: isDark ? "#e0e0e0" : "#535062",
                  boxShadow: isDark 
                    ? "0px 4px 12px rgba(255, 255, 255, 0.05), 0px 16px 32px rgba(255, 255, 255, 0.03)"
                    : "0px 4px 12px rgba(0, 0, 0, 0.1), 0px 16px 32px rgba(0, 0, 0, 0.1)",
                  borderRadius: "12px",
                  animation: "rotateCCW 40s cubic-bezier(0.000, 0.37, 1.000, 0.63) infinite",
                  animationDelay: `${-40/6 * index}s`
                }}
              >
                <a href="#" className="no-underline" style={{ color: "inherit" }}>
                  <span 
                    className="font-medium text-lg block mb-2"
                    style={{ 
                      color: isDark ? "#8b5cf6" : "#3B2ED0",
                      fontSize: "18px",
                      lineHeight: "150%"
                    }}
                  >
                    {card.name}
                  </span>
                  <span>{card.description}</span>
                </a>
              </div>
            </li>
          ))}
        </ul>

        {/* Rotating circles - Last circle (largest) */}
        <div 
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: "66%",
            aspectRatio: "1 / 1",
            transform: "translate(-50%, -50%)",
            background: isDark ? "#0f0f0f" : "#F5F4FE",
            opacity: isDark ? 0.4 : 0.25,
            boxShadow: isDark 
              ? "0px 18px 36px -18px rgba(255, 255, 255, 0.02), 0px 30px 60px -12px rgba(255, 255, 255, 0.01)"
              : "0px 18px 36px -18px rgba(12, 5, 46, 0.3), 0px 30px 60px -12px rgba(12, 5, 46, 0.25)"
          }}
        />
        
        {/* Second circle (medium) */}
        <div 
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: "40%",
            aspectRatio: "1 / 1",
            transform: "translate(-50%, -50%)",
            background: isDark ? "#1a1a1a" : "#F5F4FE",
            opacity: isDark ? 0.6 : 0.5,
            boxShadow: isDark 
              ? "0px 18px 36px -18px rgba(255, 255, 255, 0.03), 0px 30px 60px -12px rgba(255, 255, 255, 0.02)"
              : "0px 18px 36px -18px rgba(12, 5, 46, 0.3), 0px 30px 60px -12px rgba(12, 5, 46, 0.25)"
          }}
        />
      </div>

      {/* Mask effect */}
      <div 
        className="absolute top-0 left-0 bottom-0 w-1/2"
        style={{
          animation: "pulseGlow 5s linear infinite alternate",
          backgroundPosition: "100% 50%",
          backgroundRepeat: "no-repeat",
          backgroundImage: isDark 
            ? "radial-gradient(100% 50% at 100% 50%, rgba(59, 130, 246, 0.4) 0%, rgba(59, 130, 246, 0.35) 11.79%, rgba(59, 130, 246, 0.3) 21.38%, rgba(59, 130, 246, 0.25) 29.12%, rgba(59, 130, 246, 0.2) 35.34%, rgba(59, 130, 246, 0.18) 40.37%, rgba(59, 130, 246, 0.15) 44.56%, rgba(59, 130, 246, 0.12) 48.24%, rgba(59, 130, 246, 0.1) 51.76%, rgba(59, 130, 246, 0.08) 55.44%, rgba(59, 130, 246, 0.06) 59.63%, rgba(59, 130, 246, 0.05) 64.66%, rgba(59, 130, 246, 0.03) 70.88%, rgba(59, 130, 246, 0.02) 78.62%, rgba(59, 130, 246, 0.01) 88.21%, rgba(59, 130, 246, 0) 100%)"
            : "radial-gradient(100% 50% at 100% 50%, rgba(60, 26, 229, 0.25) 0%, rgba(60, 26, 229, 0.247904) 11.79%, rgba(59, 26, 229, 0.241896) 21.38%, rgba(58, 26, 229, 0.2324) 29.12%, rgba(57, 26, 229, 0.219837) 35.34%, rgba(55, 26, 229, 0.20463) 40.37%, rgba(53, 26, 229, 0.1872) 44.56%, rgba(51, 26, 229, 0.16797) 48.24%, rgba(48, 26, 229, 0.147363) 51.76%, rgba(46, 26, 229, 0.1258) 55.44%, rgba(44, 26, 229, 0.103704) 59.63%, rgba(41, 26, 229, 0.0814963) 64.66%, rgba(39, 26, 229, 0.0596) 70.88%, rgba(36, 26, 229, 0.038437) 78.62%, rgba(34, 26, 229, 0.0184296) 88.21%, rgba(32, 26, 229, 0) 100%)"
        }}
      >
        <div 
          className="absolute w-px h-full right-0 block"
          style={{
            backgroundImage: isDark 
              ? "linear-gradient(180deg, rgba(59, 130, 246, 0) 0%, #3b82f6 50%, rgba(59, 130, 246, 0) 100%)"
              : "linear-gradient(180deg, rgba(60, 26, 229, 0) 0%, #3C1AE5 50%, rgba(60, 26, 229, 0) 100%)"
          }}
        />
      </div>

      {/* Center circle with logo */}
      <div 
        className="absolute left-1/2 top-1/2 rounded-full flex items-center justify-center overflow-hidden"
        style={{
          width: "230px",
          aspectRatio: "1 / 1",
          transform: "translate(-50%, -50%)",
          background: isDark ? "#0a0a0a" : "#FFFFFF",
          boxShadow: isDark 
            ? "0px 18px 36px -18px rgba(255, 255, 255, 0.05), 0px 30px 60px -12px rgba(255, 255, 255, 0.03)"
            : "0px 18px 36px -18px rgba(12, 5, 46, 0.3), 0px 30px 60px -12px rgba(12, 5, 46, 0.25)"
        }}
      >
        <img
          src="/roamsafe.png"
          alt="RoamSafe Logo"
          className="w-full h-full object-contain"
          style={{
            filter: isDark ? "brightness(0) invert(1)" : "none" // Inverts logo colors in dark mode
          }}
        />
      </div>

      <style jsx>{`
        @keyframes rotateCW {
          from {
            transform: translate3d(0px, -50%, -1px) rotate(-45deg);
          }
          to {
            transform: translate3d(0px, -50%, 0px) rotate(-315deg);
          }
        }
        
        @keyframes rotateCCW {
          from {
            transform: rotate(45deg);
          }
          to {
            transform: rotate(315deg);
          }
        }
        
        @keyframes pulseGlow {
          from {
            background-size: 60%;
          }
          to {
            background-size: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default HeroAnimation;