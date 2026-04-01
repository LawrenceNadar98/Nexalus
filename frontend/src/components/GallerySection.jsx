import React, { useState } from 'react';
import { Upload, X, ZoomIn, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

const GallerySection = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  // Mock gallery images
  const galleryImages = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789',
      title: 'CCTV Installation - Corporate Office',
      category: 'Security Systems'
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f',
      title: 'Server Room Setup',
      category: 'Network Infrastructure'
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837',
      title: 'Access Control System',
      category: 'Security Systems'
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789',
      title: 'Fire Alarm Panel Installation',
      category: 'Fire Safety'
    },
    {
      id: 5,
      url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837',
      title: 'Building Management System',
      category: 'BMS'
    },
    {
      id: 6,
      url: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f',
      title: 'Data Center Deployment',
      category: 'Network Infrastructure'
    },
    {
      id: 7,
      url: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789',
      title: 'Hotel CCTV System',
      category: 'Hospitality'
    },
    {
      id: 8,
      url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837',
      title: 'Corporate Network Setup',
      category: 'Corporate'
    },
    {
      id: 9,
      url: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f',
      title: 'Healthcare Security System',
      category: 'Healthcare'
    }
  ];

  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      toast.success(`${files.length} image(s) selected for upload`);
      // In a real implementation, you would upload to server here
    }
  };

  const openImageModal = (image) => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <section id="gallery" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">Project Gallery</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            Our Work in Action
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Explore our successful ELV & ICT integration projects across various industries
          </p>

          {/* Upload Button */}
          <div className="inline-block">
            <label
              htmlFor="gallery-upload"
              className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all inline-flex items-center gap-2 shadow-lg shadow-blue-600/30"
            >
              <Upload className="h-5 w-5" />
              Upload Project Photos
            </label>
            <input
              id="gallery-upload"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <div
              key={image.id}
              className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer bg-gray-100"
              style={{
                animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`
              }}
              onClick={() => openImageModal(image)}
            >
              {/* Image */}
              <div className="aspect-w-16 aspect-h-12 relative h-64">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                
                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <span className="text-blue-400 text-sm font-semibold mb-2">
                    {image.category}
                  </span>
                  <h3 className="text-white font-bold text-lg mb-2">
                    {image.title}
                  </h3>
                </div>

                {/* Zoom Icon */}
                <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Info */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 px-6 py-3 rounded-full border border-blue-100">
            <ImageIcon className="h-5 w-5 text-blue-600" />
            <span className="text-gray-700 font-medium">
              {galleryImages.length} Projects Showcased
            </span>
          </div>
          <p className="text-gray-600 mt-4">
            Want to see more? <button className="text-blue-600 font-semibold hover:underline">Contact us</button> for detailed project portfolio
          </p>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={closeImageModal}
        >
          <button
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            onClick={closeImageModal}
          >
            <X className="h-6 w-6 text-white" />
          </button>
          
          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage.url}
              alt={selectedImage.title}
              className="w-full h-auto rounded-lg shadow-2xl"
            />
            <div className="mt-4 text-center">
              <span className="text-blue-400 text-sm font-semibold">
                {selectedImage.category}
              </span>
              <h3 className="text-white text-2xl font-bold mt-2">
                {selectedImage.title}
              </h3>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default GallerySection;
