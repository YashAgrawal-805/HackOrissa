import React from "react";

const ShopCard = ({ name, photo, special, address }) => {
  return (
    <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/80 backdrop-blur-sm text-white rounded-2xl shadow-xl border border-white/10 overflow-hidden group hover:border-white/30 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer">
      {/* Shop Photo with Overlay */}
      <div className="relative w-full h-32 bg-gradient-to-br from-gray-600 to-gray-700 overflow-hidden">
        {photo ? (
          <>
            <img 
              src={photo} 
              alt={name} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-600 to-slate-700">
            <div className="text-center">
              <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-white/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-white/60 text-xs">No Photo</span>
            </div>
          </div>
        )}
        
        {/* Rating Badge */}
        <div className="absolute top-2 right-2 bg-green-500/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-xs font-medium text-white">4.{Math.floor(Math.random() * 4) + 5}</span>
        </div>
        
        {/* Online Status */}
        <div className="absolute top-2 left-2 bg-green-400/90 backdrop-blur-sm px-2 py-1 rounded-full">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-green-800">Open</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Shop Name with Icon */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 flex items-center justify-center flex-shrink-0">
            <span className="text-sm">🍽️</span>
          </div>
          <h3 className="text-lg font-bold text-white truncate flex-1">{name}</h3>
        </div>

        {/* Special Dish */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded-full bg-orange-400/20 flex items-center justify-center">
              <span className="text-xs">⭐</span>
            </div>
            <span className="font-semibold text-orange-300 text-sm">Today's Special</span>
          </div>
          <p className="text-white/90 text-sm font-medium pl-7">{special}</p>
        </div>

        {/* Address */}
        <div className="flex items-start gap-2">
          <div className="w-5 h-5 rounded-full bg-blue-400/20 flex items-center justify-center mt-0.5 flex-shrink-0">
            <svg className="w-3 h-3 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-white/70 text-sm leading-relaxed">{address}</p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/30 text-white py-2 px-3 rounded-xl font-medium text-sm transition-all duration-200">
            Directions
          </button>
        </div>

      </div>
    </div>
  );
};

export default ShopCard;