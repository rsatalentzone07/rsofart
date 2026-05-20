import { useEffect, useState } from 'react';
import GalleryGrid from '../components/GalleryGrid';
import api from '../utils/api';

const CATEGORIES = ['all', 'art', 'dance', 'event', 'campus'];

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = activeCategory !== 'all' ? `?category=${activeCategory}` : '';
    api.get(`/gallery${params}`)
      .then(r => setImages(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Gallery</h1>
          <p className="font-body text-gray-300 text-lg max-w-xl mx-auto">
            A visual celebration of our students' creativity and achievements
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3 mb-10 justify-center">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => { setLoading(true); setActiveCategory(cat); }}
              className={`px-5 py-2 rounded-full font-body font-medium capitalize text-sm transition-all ${
                activeCategory === cat
                  ? 'bg-primary text-white shadow-card'
                  : 'bg-accent text-gray-600 hover:bg-primary/10'
              }`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-20 text-gray-400 font-body">
            <p className="text-xl mb-2">No images found</p>
            <p className="text-sm">Check back later for updates.</p>
          </div>
        ) : (
          <GalleryGrid images={images} />
        )}
      </div>
    </div>
  );
};

export default Gallery;
