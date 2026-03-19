import { useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import { imgFallback } from '../utils/helpers';

export default function ImageGallery({ images = [], name = '' }) {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const imgs = images.length > 0 ? images : [{ url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800' }];

  const prev = () => setCurrent((c) => (c === 0 ? imgs.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === imgs.length - 1 ? 0 : c + 1));

  return (
    <>
      <div className="relative">
        {/* Main image grid */}
        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-80 md:h-[420px] rounded-2xl overflow-hidden">
          <div className="col-span-2 row-span-2 cursor-pointer" onClick={() => setLightbox(true)}>
            <img src={imgs[0]?.url} alt={name} onError={imgFallback} className="w-full h-full object-cover hover:brightness-90 transition-all" />
          </div>
          {imgs.slice(1, 5).map((img, i) => (
            <div key={i} className="cursor-pointer relative" onClick={() => { setCurrent(i + 1); setLightbox(true); }}>
              <img src={img.url} alt={`${name} ${i + 2}`} onError={imgFallback} className="w-full h-full object-cover hover:brightness-90 transition-all" />
              {i === 3 && imgs.length > 5 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-lg">
                  +{imgs.length - 5} more
                </div>
              )}
            </div>
          ))}
        </div>
        {imgs.length > 1 && (
          <button onClick={() => setLightbox(true)} className="absolute bottom-4 right-4 bg-white text-gray-700 text-sm font-semibold px-4 py-2 rounded-xl shadow-md hover:bg-gray-50 transition-colors border border-gray-200">
            Show all photos
          </button>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-fade-in">
          <button onClick={() => setLightbox(false)} className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 p-2 rounded-full">
            <FiX size={24} />
          </button>
          <button onClick={prev} className="absolute left-4 text-white bg-white/10 hover:bg-white/20 p-3 rounded-full">
            <FiChevronLeft size={28} />
          </button>
          <div className="max-w-4xl max-h-[85vh] mx-16">
            <img src={imgs[current]?.url} alt={name} className="max-w-full max-h-[85vh] object-contain rounded-lg" />
            <p className="text-center text-white/60 text-sm mt-3">{current + 1} / {imgs.length}</p>
          </div>
          <button onClick={next} className="absolute right-4 text-white bg-white/10 hover:bg-white/20 p-3 rounded-full">
            <FiChevronRight size={28} />
          </button>
          {/* Thumbnails */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 px-8 overflow-x-auto scrollbar-hide">
            {imgs.map((img, i) => (
              <img
                key={i}
                src={img.url}
                alt=""
                onClick={() => setCurrent(i)}
                onError={imgFallback}
                className={`w-14 h-14 object-cover rounded-lg cursor-pointer flex-shrink-0 transition-all ${i === current ? 'ring-2 ring-primary-400 opacity-100' : 'opacity-50 hover:opacity-80'}`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
