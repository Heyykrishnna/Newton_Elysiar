"use client";

import React, { useEffect, useState } from "react";
import { InfiniteMovingCards } from '@/components/ui/infinite-moving-cards';

export function InfiniteMovingCardsDemo() {
  return (
    <div className="h-[40rem] rounded-md flex flex-col antialiased bg-[#fafafa] items-center justify-center relative overflow-hidden">
      <div className="text-center mb-10">
        <h2 className="text-5xl font-bold text-gray-900">
          Trusted by the <span className= 'italic font-medium'> world’s most innovative minds </span>
        </h2>
        <p className="text-gray-600 mt-2 text-lg">
          Join thousands of developers and creators who are already building the future with Elysiar.
        </p>
      </div>
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
      />
    </div>
  );
}

const testimonials = [
  {
    quote:
      "Elysiar transformed how I learn interactive AI tutors, hands-on projects, and clear roadmaps helped me build a strong portfolio. I cleared my first internship because of the projects I completed here.",
    name: "Aarav Sharma",
    title: "Computer Science Intern — Bengaluru",
  },
  {
    quote:
      "The personalized practice and instant feedback made complex topics click. The mentorship sessions are practical and career-focused highly recommended for students who want real outcomes.",
    name: "Priya Kapoor",
    title: "3rd-year B.Tech — Delhi",
  },
  {
    quote:
      "As an instructor I now recommend Elysiar to all my bootcamp students. The project templates and assessment flow mean students finish with job-ready skills faster than before.",
    name: "Rohit Menon",
    title: "Bootcamp Instructor — Mumbai",
  },
  {
    quote:
      "Elysiar's learning path kept my daughter engaged and accountable. Bite-sized lessons, weekly quizzes and progress tracking make steady improvement easy to see.",
    name: "Nisha Reddy",
    title: "Parent — Hyderabad",
  },
  {
    quote:
      "I learned data-science fundamentals and applied them to a real project on Elysiar, landed a data analyst role within months. Practical, guided and India-friendly curriculum.",
    name: "Saanvi Patel",
    title: "Data Analyst — Pune",
  },
];
