import { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import { FaAngleDown } from "react-icons/fa";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox'
import Slider from '@mui/material/Slider';
import Rating from '@mui/material/Rating';

const CATEGORIES = [
  "Fashion", "Electronics", "Bags", "Footware", "Jewelery", "Wellness", "Beauty", "Games"
];

const SideBar = ({
  selectedCategory = '',
  onCategoryChange,
  priceRange = [0, 1000000],
  onPriceChange,
  selectedRating = 0,
  onRatingChange,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [localPrice, setLocalPrice] = useState(priceRange);

  useEffect(() => {
    setLocalPrice(priceRange);
  }, [priceRange]);

  const toggleCollapse = () => setIsOpen(!isOpen);

  const handleCategoryToggle = (cat) => {
    if (onCategoryChange) {
      onCategoryChange(selectedCategory === cat ? '' : cat);
    }
  };

  const handlePriceChange = (_, newValue) => {
    setLocalPrice(newValue);
  };

  const handlePriceCommit = () => {
    if (onPriceChange) {
      onPriceChange(localPrice);
    }
  };

  const handleRatingToggle = (rating) => {
    if (onRatingChange) {
      onRatingChange(selectedRating === rating ? 0 : rating);
    }
  };

  return (
    <aside className="sidebar py-3 lg:py-5 static lg:sticky top-32.5 z-50 pr-0 lg:pr-5">
      <div className="sidebarScroll max-h-[60vh] lg:max-h-max lg:overflow-visible overflow-auto w-full">

        {/* Shop by Category */}
        <div className="box">
          <h3 className='w-full mb-3 text-[16px] font-semibold flex items-center pr-5'>
            Shop by Category
            <Button
              className="w-7.5! h-7.5! min-w-7.5! rounded-full! ml-auto! text-black!"
              onClick={toggleCollapse}
            >
              <FaAngleDown className={`transition-transform duration-300 ${isOpen ? '' : '-rotate-180'}`} />
            </Button>
          </h3>

          <div className={`scroll px-4 relative -left-3.25 flex flex-col gap-2 transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-125 opacity-100' : 'max-h-0 opacity-0'}`}>
            {CATEGORIES.map((cat) => (
              <FormControlLabel
                key={cat}
                control={
                  <Checkbox
                    className='fill-[#ff5252]! text-[#ff5252]!'
                    checked={selectedCategory === cat}
                    onChange={() => handleCategoryToggle(cat)}
                  />
                }
                label={cat}
                className='text-black!'
              />
            ))}
          </div>
        </div>

        {/* Filter By Price */}
        <div className="box mt-4">
          <h3 className="w-full mb-3 text-[16px] font-semibold flex items-center pr-5">Filter By Price</h3>
          <Slider
            value={localPrice}
            onChange={handlePriceChange}
            onChangeCommitted={handlePriceCommit}
            min={0}
            max={1000000}
            className='text-[#ff5252]!'
          />
          <div className="flex pt-4 pb-2 priceRange">
            <span className="text-[13px]">
              From: <strong className='text-dark'>₦{localPrice[0].toLocaleString()}</strong>
            </span>
            <span className='ml-auto text-[13px]'>
              To: <strong className='text-dark'>₦{localPrice[1].toLocaleString()}</strong>
            </span>
          </div>
        </div>

        {/* Filter By Rating */}
        <div className="box mt-4">
          <h3 className="w-full mb-3 text-[16px] font-semibold flex items-center pr-5">Filter By Rating</h3>
          {[5, 4, 3, 2, 1].map((rating) => (
            <div
              key={rating}
              className="flex items-center pl-2 lg:pl-1 cursor-pointer hover:bg-neutral-50 rounded-lg py-1 transition"
              onClick={() => handleRatingToggle(rating)}
            >
              <Checkbox
                className='fill-[#ff5252]! text-[#ff5252]!'
                checked={selectedRating === rating}
                onChange={() => handleRatingToggle(rating)}
              />
              <Rating readOnly value={rating} size="small" />
              <span className="text-xs text-neutral-400 ml-1">& up</span>
            </div>
          ))}
        </div>

      </div>
    </aside>
  )
}

export default SideBar
