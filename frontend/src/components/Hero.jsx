import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import heroImg from "../assets/blog.png";

const Hero = () => {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="px-4 md:px-0  ">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center min-h-[420px] my-10 md:my-0 ">

        {/* LEFT TEXT SECTION */}
        <div className="max-w-2xl md:w-1/2" ref={ref}>
          <div style={{ display: "inline-block" }}>
            
            {/* LINE 1 */}
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold mb-2"
              style={{
                fontFamily: "'Courgette', cursive",
                whiteSpace: "nowrap",
                opacity: 0,
                animation: show
                  ? "slideLeft 1.2s ease-out forwards"
                  : "none",
              }}
            >
              Unlock the Newest Trends
            </h1>

            {/* LINE 2 */}
            <h1
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold"
              style={{
                fontFamily: "'Courgette', cursive",
                opacity: 0,
                animation: show
                  ? "slideRight 1.2s ease-out forwards 0.6s"
                  : "none",
              }}
            >
              in Tech & Web Space
            </h1>

            {/* PARAGRAPH */}
           <p
  className="text-lg md:text-xl opacity-80 mb-6 mt-4"
  style={{
    opacity: 0,
    animation: show
      ? "fadeUp 1s ease-out forwards 1.4s"
      : "none",
  }}
>
  Empower your journey with actionable tutorials, expert perspectives,
  and the latest breakthroughs in tech and the digital landscape.
</p>


            {/* BUTTONS */}
            <div className="flex space-x-4">
              <Link to={"/dashboard/write-blog"}>
                <Button
                  className="px-3 py-2 text-lg bg-green-900 text-white border rounded-md transition-all duration-300 hover:bg-green-800 hover:scale-105"
                  style={{ fontFamily: "'Lobster', cursive" }}
                >
                  Get Started
                </Button>
              </Link>

              <Link to={'/about'}>
                <Button
                  className="px-3 py-2 text-lg bg-green-800 text-white border rounded-md transition-all duration-300 hover:bg-green-700 hover:scale-105"
                  style={{ fontFamily: "'Lobster', cursive" }}
                >
                  Learn More
                </Button>
              </Link>
            </div>

          </div>

          {/* KEYFRAME ANIMATIONS */}
          <style>
            {`
            @keyframes slideLeft {
              0% { opacity: 0; transform: translateX(-40px); }
              100% { opacity: 1; transform: translateX(0); }
            }
            @keyframes slideRight {
              0% { opacity: 0; transform: translateX(40px); }
              100% { opacity: 1; transform: translateX(0); }
            }
            @keyframes fadeUp {
              0% { opacity: 0; transform: translateY(30px); }
              100% { opacity: 1; transform: translateY(0); }
            }
          `}
          </style>
        </div>

        {/* RIGHT IMAGE SECTION */}
        <div className="flex items-center justify-center md:w-1/2 mt-10 md:mt-0">
          <img
            src={heroImg}
            alt=""
            className="md:h-[450px] md:w-[450px]"
          />
        </div>

      </div>
    </div>
  );
};

export default Hero;
