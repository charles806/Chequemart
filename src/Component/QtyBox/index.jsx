import { Button } from "@mui/material";
import { useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";


export const QtyBox = () => {
    const [qty, setQty] = useState(1);

    const increment = () => setQty(prev => prev + 1);
    const decrement = () => setQty(prev => Math.max(1, prev - 1));

    const handleInput = (e) => {
        const val = parseInt(e.target.value);
        if (!isNaN(val) && val >= 1) setQty(val);
    };

    return (
        <div className="qtyBox flex items-center relative w-[110px]">
            <input
                type="number"
                value={qty}
                onChange={handleInput}
                className="w-full h-[50px] pl-3 pr-10 text-[15px] focus:outline-none border border-[rgba(0,0,0,0.1)] rounded-md appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <div className="absolute right-0 top-0 h-full flex flex-col border-l border-[rgba(0,0,0,0.1)]">
                <Button
                    onClick={increment}
                    className="!min-w-[32px] !w-[32px] flex-1 !rounded-none !rounded-tr-md !text-gray-500 hover:!bg-red-50 hover:!text-red-500 !p-0 !border-none !bg-white"
                >
                    <FaAngleUp className="text-[11px]" />
                </Button>
                <div className="border-t border-[rgba(0,0,0,0.1)]" />
                <Button
                    onClick={decrement}
                    disabled={qty <= 1}
                    className="!min-w-[32px] !w-[32px] flex-1 !rounded-none !rounded-br-md !text-gray-500 hover:!bg-red-50 hover:!text-red-500 disabled:!text-gray-300 !p-0 !border-none !bg-white"
                >
                    <FaAngleDown className="text-[11px]" />
                </Button>
            </div>

 
        </div>
    );
};