"use client";

import { useState, useRef, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { RotateCw, ZoomIn, ZoomOut, Check, X as CloseIcon } from 'lucide-react';

interface ImageCropperProps {
  file: File;
  onCropComplete: (croppedFile: File) => void;
  onCancel: () => void;
  aspectRatio?: number;
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

export default function ImageCropper({ file, onCropComplete, onCancel, aspectRatio = 1 }: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    if (aspectRatio) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspectRatio));
    }
  }, [aspectRatio]);

  const getCroppedImg = useCallback(
    async (
      image: HTMLImageElement,
      pixelCrop: PixelCrop,
      fileName: string,
    ): Promise<File> => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('No 2d context');
      }

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(
        image,
        pixelCrop.x * scaleX,
        pixelCrop.y * scaleY,
        pixelCrop.width * scaleX,
        pixelCrop.height * scaleY,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height,
      );

      return new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas is empty'));
              return;
            }
            const file = new File([blob], fileName, { type: 'image/jpeg' });
            resolve(file);
          },
          'image/jpeg',
          0.95,
        );
      });
    },
    [],
  );

  const handleCropComplete = async () => {
    if (!completedCrop || !imgRef.current) {
      return;
    }

    try {
      setIsProcessing(true);
      const croppedFile = await getCroppedImg(
        imgRef.current,
        completedCrop,
        file.name,
      );
      onCropComplete(croppedFile);
    } catch (error) {
      console.error('Error cropping image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRotate = () => {
    setRotate((prev) => (prev + 90) % 360);
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.1));
  };

  const imageUrl = URL.createObjectURL(file);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Edit Profile Picture</h3>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Image Cropper */}
        <div className="p-4 flex flex-col items-center">
          <div className="relative max-w-full max-h-[60vh] overflow-auto">
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspectRatio}
              circularCrop
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imgRef}
                alt="Crop me"
                src={imageUrl}
                style={{
                  transform: `scale(${scale}) rotate(${rotate}deg)`,
                  maxWidth: '100%',
                  maxHeight: '100%',
                }}
                onLoad={onImageLoad}
              />
            </ReactCrop>
          </div>

          {/* Controls */}
          <div className="mt-4 flex items-center gap-4">
            <button
              onClick={handleRotate}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm"
            >
              <RotateCw className="w-4 h-4" />
              Rotate
            </button>
            
            <button
              onClick={handleZoomOut}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm"
            >
              <ZoomOut className="w-4 h-4" />
              Zoom Out
            </button>
            
            <button
              onClick={handleZoomIn}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm"
            >
              <ZoomIn className="w-4 h-4" />
              Zoom In
            </button>
          </div>

          {/* Scale Slider */}
          <div className="mt-4 w-full max-w-xs">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zoom: {Math.round(scale * 100)}%
            </label>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleCropComplete}
            disabled={!completedCrop || isProcessing}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Apply Crop
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
