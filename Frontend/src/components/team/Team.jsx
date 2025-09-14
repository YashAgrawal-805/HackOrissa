import React, { useState, useEffect } from 'react';

// Title component (assuming it's similar to your original)
const Title = ({ title, desc }) => (
  <div className="text-center mb-2 mt-4 px-4">
    <h1 className="text-4xl lg:text-5xl font-bold text-[#082a7b] mb-2">{title}</h1>
    <p className="text-lg text-gray-600 max-w-2xl mx-auto">{desc}</p>
  </div>
);

const teamMembers = [
  { name: 'Yash Agrawal', role: 'Team Lead' },
  { name: 'Naresh Kumar', role: 'UI/UX designer' },
  { name: 'Swaraj Ku. Sahoo', role: 'Technical Lead' },
  { name: 'Shantanu Ku. Adhikari', role: 'ML Lead' },
  { name: 'Subrat Ku. Malla', role: 'Content Lead' },
];

const memberImages = [
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=3687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmVzc2lvbmFsJTIwcGVvcGxlfGVufDB8fDB8fHww',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cHJvZmVzc2lvbmFsJTIwcGVvcGxlfGVufDB8fDB8fHww',
  'https://images.unsplash.com/photo-1655249481446-25d575f1c054?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fHByb2Zlc3Npb25hbCUyMHBlb3BsZXxlbnwwfHwwfHx8MA%3D%3D',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=3687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
];

const Team = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const updateCarousel = (newIndex) => {
    if (isAnimating) return;
    setIsAnimating(true);
    const totalMembers = teamMembers.length;
    const nextIndex = (newIndex + totalMembers) % totalMembers;
    setCurrentIndex(nextIndex);
    setTimeout(() => {
      setIsAnimating(false);
    }, 800);
  };

  const getCardClasses = (index) => {
    const offset = (index - currentIndex + teamMembers.length) % teamMembers.length;
    let classes = 'absolute bg-white rounded-[20px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.15)] transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] cursor-pointer';

    if (offset === 0) {
      classes += ' z-10 scale-110 translate-z-0';
    } else if (offset === 1) {
      classes += ' z-5 scale-90 translate-x-[120px] lg:translate-x-[200px] translate-z-[-100px] opacity-90 grayscale-100';
    } else if (offset === 2) {
      classes += ' z-1 scale-80 translate-x-[250px] lg:translate-x-[400px] translate-z-[-300px] opacity-70 grayscale-100';
    } else if (offset === teamMembers.length - 1) {
      classes += ' z-5 scale-90 -translate-x-[120px] lg:-translate-x-[200px] translate-z-[-100px] opacity-90 grayscale-100';
    } else if (offset === teamMembers.length - 2) {
      classes += ' z-1 scale-80 -translate-x-[250px] lg:-translate-x-[400px] translate-z-[-300px] opacity-70 grayscale-100';
    } else {
      classes += ' opacity-0 pointer-events-none';
    }

    classes += ' w-[150px] h-[200px] sm:w-[200px] sm:h-[250px] lg:w-[280px] lg:h-[350px]';

    return classes;
  };

  useEffect(() => {
    const handleKeydown = (e) => {
      if (e.key === 'ArrowLeft') {
        updateCarousel(currentIndex - 1);
      } else if (e.key === 'ArrowRight') {
        updateCarousel(currentIndex + 1);
      }
    };
    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [currentIndex]);

  const handleTouchSwipe = (e) => {
    const touchStartX = e.touches[0].clientX;
    const handleTouchEnd = (endEvent) => {
      const touchEndX = endEvent.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      const swipeThreshold = 50;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          updateCarousel(currentIndex + 1);
        } else {
          updateCarousel(currentIndex - 1);
        }
      }
      endEvent.target.removeEventListener('touchend', handleTouchEnd);
    };
    e.target.addEventListener('touchend', handleTouchEnd);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen overflow-hidden font-sans">
      <Title
        title="Meet the team"
        desc="A passionate team of digital experts dedicated to your brand's success."
      />

      <div className="relative w-full max-w-[1200px] h-[350px] sm:h-[400px] lg:h-[500px] mt-4 lg:mt-6 perspective-[1000px]">
        <div className="relative w-full h-full flex justify-center items-center transform-style-preserve-3d transition-transform duration-800 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className={getCardClasses(index)}
              onClick={() => updateCarousel(index)}
              onTouchStart={handleTouchSwipe}
            >
              <img
                src={memberImages[index]}
                alt={`Team Member ${index + 1}`}
                className="w-full h-full object-cover transition-all duration-800 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
              />
            </div>
          ))}
        </div>

        <button
          className="nav-arrow left absolute top-1/2 -translate-y-1/2 left-[20px] w-[40px] h-[40px] rounded-full bg-[rgba(8,42,123,0.6)] text-white flex items-center justify-center cursor-pointer z-20 transition-all duration-300 text-3xl pb-1 px-1 border-none outline-none hover:bg-[rgba(0,0,0,0.8)] hover:scale-110"
          onClick={() => updateCarousel(currentIndex - 1)}
        >
          ‹
        </button>
        <button
          className="nav-arrow right absolute top-1/2 -translate-y-1/2 right-[20px] w-[40px] h-[40px] rounded-full bg-[rgba(8,42,123,0.6)] text-white flex items-center justify-center cursor-pointer z-20 transition-all duration-300 text-3xl pb-1 px-1 border-none outline-none hover:bg-[rgba(0,0,0,0.8)] hover:scale-110"
          onClick={() => updateCarousel(currentIndex + 1)}
        >
          ›
        </button>
      </div>

      <div className="text-center mt-6 lg:mt-8 transition-all duration-500 ease-out">
        <h2 className="member-name text-[#082a7b] text-[1.8rem] sm:text-2xl lg:text-[2.5rem] font-bold mb-[10px] relative inline-block">
          {teamMembers[currentIndex].name}
          <span className="absolute left-[-70px] lg:left-[-120px] top-full w-[50px] lg:w-[100px] h-[2px] bg-[#082a7b]"></span>
          <span className="absolute right-[-70px] lg:right-[-120px] top-full w-[50px] lg:w-[100px] h-[2px] bg-[#082a7b]"></span>
        </h2>
        <p className="member-role text-[#848696] text-lg lg:text-[1.5rem] font-medium opacity-80 uppercase tracking-[0.1em] pt-[10px] -mt-[15px] relative">
          {teamMembers[currentIndex].role}
        </p>
      </div>

      <div className="flex justify-center gap-[10px] mt-4 lg:mt-6">
        {teamMembers.map((_, index) => (
          <div
            key={index}
            className={`dot w-[12px] h-[12px] rounded-full bg-[rgba(8,42,123,0.2)] cursor-pointer transition-all duration-300 ${
              currentIndex === index ? 'bg-[#082a7b] scale-125' : ''
            }`}
            onClick={() => updateCarousel(index)}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Team;