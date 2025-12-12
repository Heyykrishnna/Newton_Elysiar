import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  {
    value: "5+",
    label: "in the education technology industry",
    color: "bg-white/5",
    size: "w-48 h-48",
    x: -250,
    y: -50
  },
  {
    value: "15K",
    label: "educators have embraced Eduwerks",
    color: "bg-white/5",
    size: "w-56 h-56",
    x: -100,
    y: 180
  },
  {
    icon: (
      <svg className="w-24 h-24 text-yellow-400" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="50" cy="50" r="30" />
        <path d="M50 10 L50 20 M50 80 L50 90 M90 50 L80 50 M20 50 L10 50 M78 22 L71 29 M29 71 L22 78 M78 78 L71 71 M29 29 L22 22" />
      </svg>
    ),
    color: "bg-white/5",
    size: "w-40 h-40",
    x: 80,
    y: -120
  },
  {
    value: "800",
    label: "schools collaborates with worldwide",
    color: "bg-white/5",
    size: "w-52 h-52",
    x: 220,
    y: 20
  },
  {
    value: "40+",
    label: "Awards, Eduwerks is recognized",
    color: "bg-white/5",
    size: "w-44 h-44",
    x: 400,
    y: 160
  },
  // New circles
  {
    value: "98%",
    label: "Student Satisfaction",
    color: "bg-blue-500/10",
    size: "w-36 h-36",
    x: -350,
    y: 100
  },
  {
    value: "12K+",
    label: "College Students",
    color: "bg-red-500/10",
    size: "w-48 h-48",
    x: -650,
    y: 200
  },
  {
    value: "24/7",
    label: "AI Support",
    color: "bg-purple-500/10",
    size: "w-32 h-32",
    x: -450,
    y: -50
  }
];

export const StatsSection = () => {
  return (
    <section className="relative py-32 min-h-screen flex items-center justify-center overflow-hidden bg-[#fafafa] text-black dark:bg-[#090607] dark:text-white transition-colors">
      <div className="absolute top-20 text-center z-10 w-full px-4">
        <h2 className="text-4xl md:text-7xl font-bold mb-6 text-slate-800 dark:text-slate-200 tracking-tight leading-tight">
          We believe<br />
          in the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">potential</span> <span className="text-gray-400 font-light italic">for</span><br />
          technology <span className="text-gray-400 font-light italic">to reshape the</span><br />
          learning experience.
        </h2>
      </div>

      <div className="relative w-full max-w-7xl h-[700px] mt-32">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.8, 
              delay: index * 0.1,
              type: "spring",
              bounce: 0.4
            }}
            viewport={{ once: true }}
            className={`absolute flex flex-col items-center justify-center text-center rounded-full backdrop-blur-md border border-black/5 dark:border-white/10 shadow-xl ${stat.color} ${stat.size} hover:bg-white/10 transition-colors cursor-pointer`}
            style={{ 
              left: '50%', 
              top: '50%',
              marginLeft: stat.x,
              marginTop: stat.y,
              transform: `translate(-50%, -50%)`
            }}
            whileHover={{ scale: 1.15, zIndex: 50 }}
            animate={{
              y: [0, -10, 0],
              transition: {
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2
              }
            }}
          >
            {stat.icon ? (
              stat.icon
            ) : (
              <>
                <div className="text-3xl md:text-5xl font-bold mb-2 text-slate-800 dark:text-slate-100">{stat.value}</div>
                <div className="text-xs md:text-sm text-slate-600 dark:text-slate-400 max-w-[85%] font-medium">{stat.label}</div>
              </>
            )}
          </motion.div>
        ))}
        
        {/* Decorative 3D Element on the right */}
        <motion.div 
          className="absolute right-0 top-1/2 -translate-y-1/2 w-80 h-80 opacity-60 pointer-events-none"
          animate={{ 
            rotate: 360,
            y: [0, -30, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          {/* Conceptual Green Glass Object */}
          <div className="w-full h-full bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-[3rem] blur-2xl border border-white/10" />
        </motion.div>
      </div>
    </section>
  );
};
