import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, Check, ZoomIn, ZoomOut } from 'lucide-react';

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', reject);
    img.setAttribute('crossOrigin', 'anonymous');
    img.src = url;
  });

const getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);
  return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.92));
};

const ImageCropModal = ({ imageSrc, aspect = 4 / 3, onDone, onCancel, title = 'Crop Image' }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleDone = async () => {
    const blob = await getCroppedImg(imageSrc, croppedAreaPixels);
    onDone(blob);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 bg-black/60 border-b border-white/10">
        <h3 className="font-display text-white text-lg font-semibold">{title}</h3>
        <button onClick={onCancel} className="text-white/60 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="relative flex-1">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>

      <div className="bg-black/60 border-t border-white/10 px-5 py-4 flex items-center gap-4">
        <ZoomOut size={18} className="text-white/60 shrink-0" />
        <input
          type="range" min={1} max={3} step={0.05}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="flex-1 accent-primary"
        />
        <ZoomIn size={18} className="text-white/60 shrink-0" />
        <button
          onClick={handleDone}
          className="ml-4 flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-lg font-body font-semibold text-sm hover:bg-primary/90 transition-all"
        >
          <Check size={16} /> Apply Crop
        </button>
      </div>
    </div>
  );
};

export default ImageCropModal;