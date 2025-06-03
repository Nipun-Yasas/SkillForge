"use client";
import React from "react";
import StarBorderIcon from '@mui/icons-material/StarBorder';

const mentors = Array(6).fill({
  name: "Alex Jhons",
  location: "Moratuwa, Sri Lanka",
  rating: "4.5/5",
  skills: ["Web Development", "Java", "Python", "Node.Js", "Video Editing"],
  image: "/profile-pic.png",
});

export default function MentorsCards(){
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {mentors.map((mentor, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md overflow-hidden relative"
          >
            {/* Top Gradient Section */}
            <div className="bg-gradient-to-r from-[#4D9ECA] to-[#34377F] px-4 pt-4 pb-15 text-white rounded-t-xl relative">
              <div>
                <div className="text-xl font-semibold">{mentor.name}</div>
                <div className="text-xs text-white/80">{mentor.location}</div>
              </div>
              {/* Rating */}
              <div className="absolute top-2 right-2 flex items-center gap-1 bg-white text-black px-2 py-1 text-xs rounded-full shadow-sm">
                <StarBorderIcon className="w-3 h-3 text-yellow-400" fill="currentColor" />
                {mentor.rating}
              </div>
              {/* Profile Image */}
              <div className="absolute -bottom-6 left-4 w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-md bg-white">
                <img
                  src={mentor.image}
                  alt={mentor.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Card Content */}
            <div className="px-4 pb-4 pt-8 text-left">
              <div className="text-sm font-semibold mb-2">CAN TEACH</div>
              <div className="flex flex-wrap gap-2 mb-6">
                {mentor.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <div className="text-sm font-semibold mb-2">CAN TEACH</div>
              <div className="flex flex-wrap gap-2 mb-4">
                {mentor.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <button className="w-full bg-gradient-to-r from-[#4D9ECA] to-[#34377F] text-white py-2 rounded-lg text-sm font-semibold shadow hover:opacity-90 transition">
                Request mentorship
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <button className="bg-[#4C98C6] text-white px-6 py-2 rounded-md hover:bg-blue-600">
          Load More
        </button>
      </div>
    </>
  );
};


