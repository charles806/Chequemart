import React from 'react';

const SkeletonCard = () => (
  <div className="bg-white rounded-xl shadow-sm p-3 animate-pulse">
    <div className="h-48 bg-gray-200 rounded-lg mb-3" />
    <div className="h-3 bg-gray-200 rounded w-1/3 mb-2" />
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
    <div className="h-4 bg-gray-200 rounded w-1/2" />
  </div>
);

const SkeletonProductGrid = ({ count = 8 }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {[...Array(count)].map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

const SkeletonListItem = () => (
  <div className="flex items-center gap-4 p-4 bg-white rounded-lg animate-pulse">
    <div className="w-20 h-20 bg-gray-200 rounded-md" />
    <div className="flex-1">
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
    </div>
  </div>
);

const SkeletonBanner = () => (
  <div className="h-64 md:h-80 bg-gray-200 rounded-xl animate-pulse" />
);

const SkeletonText = ({ lines = 2 }) => (
  <div className="space-y-2">
    {[...Array(lines)].map((_, i) => (
      <div key={i} className="h-3 bg-gray-200 rounded" style={{ width: `${Math.random() * 40 + 60}%` }} />
    ))}
  </div>
);

const SkeletonPage = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="my-container">
      {/* Header skeleton */}
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 bg-gray-200 rounded w-40 animate-pulse" />
        <div className="h-8 bg-gray-200 rounded w-24 animate-pulse" />
      </div>
      
      {/* Banner skeleton */}
      <SkeletonBanner />
      
      {/* Category tabs skeleton */}
      <div className="flex gap-2 mt-6 overflow-x-auto">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-200 rounded-full w-24 flex-shrink-0 animate-pulse" />
        ))}
      </div>
      
      {/* Products grid skeleton */}
      <div className="mt-8">
        <SkeletonProductGrid count={8} />
      </div>
    </div>
  </div>
);

const SkeletonProductDetail = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="my-container">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Images skeleton */}
        <div className="lg:w-1/2">
          <div className="h-96 bg-gray-200 rounded-xl animate-pulse mb-4" />
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-20 h-20 bg-gray-200 rounded-md animate-pulse" />
            ))}
          </div>
        </div>
        
        {/* Info skeleton */}
        <div className="lg:w-1/2 space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
          <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
          <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
          <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  </div>
);

const SkeletonBlog = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="my-container">
      <div className="h-10 bg-gray-200 rounded w-40 animate-pulse mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-5 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const SkeletonCart = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="my-container">
      <div className="h-8 bg-gray-200 rounded w-40 animate-pulse mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {[...Array(3)].map((_, i) => (
            <SkeletonListItem key={i} />
          ))}
        </div>
        <div className="bg-white rounded-lg p-4 h-64 animate-pulse" />
      </div>
    </div>
  </div>
);

export { 
  SkeletonCard, 
  SkeletonProductGrid, 
  SkeletonListItem, 
  SkeletonBanner, 
  SkeletonText, 
  SkeletonPage, 
  SkeletonProductDetail,
  SkeletonBlog,
  SkeletonCart
};