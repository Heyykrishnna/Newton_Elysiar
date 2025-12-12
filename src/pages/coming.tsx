import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const ComingSoon = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div 
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      style={{ fontFamily: "'Work Sans', sans-serif" }}
    >
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
            backgroundImage: `url(${"https://img.freepik.com/free-vector/aesthetic-dreamy-background-purple-cloudy-sky-vector-glitter-design_53876-156334.jpg?semt=ais_hybrid&w=740&q=80"})`,
          filter: 'blur(12px)',
          transform: 'scale(1.1)'
        }}
      />
      
      <div className="absolute inset-0 bg-black/30" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <h1 
          className="mb-4 text-9xl font-bold text-black drop-shadow-2xl"
          style={{ fontFamily: "'Work Sans', sans-serif", fontWeight: 900 }}
        >
          503
        </h1>
        <p 
          className="mb-4 text-2xl text-white font-bold drop-shadow-lg"
          style={{ fontFamily: "'Work Sans', sans-serif", fontWeight: 700 }}
        >
          PAYMENT IS NOT AVAILABLE
        </p>
        <p 
          className="mb-6 text-lg text-white/70 drop-shadow-md mx-auto"
          style={{ fontFamily: "'Work Sans', sans-serif", fontWeight: 500 }}
        >
          Payment is currently not available on Elysiar.
          <br/>
          We are working hard to enable payments and bring more features soon.
        </p>
         <p 
          className="mb-6 text-xs text-white/50 drop-shadow-md mx-auto"
          style={{ fontFamily: "'Work Sans', sans-serif", fontWeight: 500 }}
        >
          -BY TEAM ELYSIAR
        </p>
        <a 
          href="/" 
          className="inline-block px-6 py-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          style={{ fontFamily: "'Work Sans', sans-serif", fontWeight: 600 }}
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default ComingSoon;
