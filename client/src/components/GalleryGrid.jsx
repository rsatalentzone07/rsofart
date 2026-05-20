import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || '';

const GalleryGrid = ({ images }) => {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const slides = images.map(img => ({
    src: img.imageUrl.startsWith('http') ? img.imageUrl : `${API_BASE}${img.imageUrl}`,
    alt: img.caption || '',
  }));

  return (
    <>
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
        {images.map((img, i) => (
          <div
            key={img._id || i}
            className="break-inside-avoid rounded-xl overflow-hidden cursor-pointer group relative shadow-card hover:shadow-card-hover transition-all duration-300"
            onClick={() => { setIndex(i); setOpen(true); }}
          >
            <img
              src={img.imageUrl.startsWith('http') ? img.imageUrl : `${API_BASE}${img.imageUrl}`}
              alt={img.caption || 'Gallery image'}
              className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            {img.caption && (
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                <p className="text-white text-sm font-body">{img.caption}</p>
              </div>
            )}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="bg-secondary text-xs text-dark font-semibold px-2 py-0.5 rounded-full capitalize font-body">
                {img.category}
              </span>
            </div>
          </div>
        ))}
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        index={index}
        styles={{ container: { backgroundColor: 'rgba(0,0,0,0.95)' } }}
      />
    </>
  );
};

export default GalleryGrid;
