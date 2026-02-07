import { useState } from 'react'
import Button from '@mui/material/Button'
import { FaAngleDown } from "react-icons/fa";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox'
import Slider from '@mui/material/Slider';
import Rating from '@mui/material/Rating';

const SideBar = () => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleCollapse = () => {
        setIsOpen(!isOpen);
    };

    const [value, setValue] = useState([0, 1000000]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    return (
        <aside className="sidebar py-3  lg:py-5 static lg:sticky top-32.5 z-50 pr-0 lg:pr-5">
            <div className="sidebarScroll max-h-[60vh] lg:max-h-max  lg:overflow-visible overflow-auto w-full">
                <div className="box">
                    <h3 className='w-full mb-3 text-[16px] font-semibold flex items-center pr-5'>
                        {"Shop by Category"}
                        <Button
                            className="w-7.5! h-7.5! min-w-7.5! rounded-full! ml-auto! text-black!"
                            onClick={toggleCollapse}
                        >
                            <FaAngleDown className={`transition-transform duration-300 ${isOpen ? '' : '-rotate-180'}`} />
                        </Button>
                    </h3>

                    <div
                        className={`scroll px-4 relative -left-3.25 flex flex-col gap-2 transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-125 opacity-100' : 'max-h-0 opacity-0'
                            }`}
                    >
                        <FormControlLabel control={<Checkbox className='fill-[#ff5252]! text-[#ff5252]!' />} label="Fashion" className='fill-[#ff5252]! text-black!' />
                        <FormControlLabel control={<Checkbox className='fill-[#ff5252]! text-[#ff5252]!' />} label="Electronics" className='fill-[#ff5252]! text-black!' />
                        <FormControlLabel control={<Checkbox className='fill-[#ff5252]! text-[#ff5252]!' />} label="Bags" className='fill-[#ff5252]! text-black!' />
                        <FormControlLabel control={<Checkbox className='fill-[#ff5252]! text-[#ff5252]!' />} label="Footware" className='fill-[#ff5252]! text-black!' />
                        <FormControlLabel control={<Checkbox className='fill-[#ff5252]! text-[#ff5252]!' />} label="Jewellery" className='fill-[#ff5252]! text-black!' />
                        <FormControlLabel control={<Checkbox className='fill-[#ff5252]! text-[#ff5252]!' />} label="Wellness" className='fill-[#ff5252]! text-black!' />
                        <FormControlLabel control={<Checkbox className='fill-[#ff5252]! text-[#ff5252]!' />} label="Beauty" className='fill-[#ff5252]! text-black!' />
                        <FormControlLabel control={<Checkbox className='fill-[#ff5252]! text-[#ff5252]!' />} label="Games" className='fill-[#ff5252]! text-black!' />
                    </div>

                </div>
                <div className="box mt-4">
                    <h3 className="w-full mb-3 text-[16px] font-semibold flex items-center pr-5">Filter By Price</h3>
                    <Slider
                        value={value}
                        onChange={handleChange}
                        min={0}
                        max={1000000}
                        className='text-[#ff5252]!'
                    />
                    <div className="flex pt-4 pb-2 priceRange">
                        <span className="text-[13px]">
                            {" From: "}
                            <strong className='text-dark'>₦{value[0].toLocaleString()}</strong>
                        </span>
                        <span className='ml-auto text-[13px]'>
                            {" To: "}
                            <strong className='text-dark'>₦{value[1].toLocaleString()}</strong>
                        </span>
                    </div>
                </div>
                <div className="box mt-4">
                    <h3 className="w-full mb-3 text-[16px] font-semibold flex items-center pr-5">Filter By Rating</h3>
                    <div className="flex items-center pl-2 lg:pl-1">
                        <Checkbox className='fill-[#ff5252]! text-[#ff5252]!' />
                        <Rating readOnly value={1} />
                    </div>
                    <div className="flex items-center pl-2 lg:pl-1">
                        <Checkbox className='fill-[#ff5252]! text-[#ff5252]!' />
                        <Rating readOnly value={2} />
                    </div>
                    <div className="flex items-center pl-2 lg:pl-1">
                        <Checkbox className='fill-[#ff5252]! text-[#ff5252]!' />
                        <Rating readOnly value={3} />
                    </div>
                    <div className="flex items-center pl-2 lg:pl-1">
                        <Checkbox className='fill-[#ff5252]! text-[#ff5252]!' />
                        <Rating readOnly value={4} />
                    </div>
                    <div className="flex items-center pl-2 lg:pl-1">
                        <Checkbox className='fill-[#ff5252]! text-[#ff5252]!' />
                        <Rating readOnly value={5} />
                    </div>
                </div>
            </div>
        </aside>
    )
}

export default SideBar