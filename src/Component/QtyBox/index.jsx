import { Button } from "@mui/material";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import PropTypes from "prop-types";


export const QtyBox = ({ value, onChange, min = 1, max = 99 }) => {
    // Fully controlled component - use value prop directly
    const qty = value ?? 1;

    const increment = () => {
        const newQty = Math.min(qty + 1, max);
        onChange?.(newQty);
    };

    const decrement = () => {
        const newQty = Math.max(qty - 1, min);
        onChange?.(newQty);
    };

    const handleInput = (e) => {
        const val = parseInt(e.target.value);
        if (!isNaN(val) && val >= min && val <= max) {
            onChange?.(val);
        }
    };

    return (
        <div className="qtyBox flex items-center relative w-[110px]">
            <input
                type="number"
                value={qty}
                onChange={handleInput}
                min={min}
                max={max}
                className="w-full h-[50px] pl-3 pr-10 text-[15px] focus:outline-none border border-[rgba(0,0,0,0.1)] rounded-md appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                aria-label="Quantity"
            />
            <div className="absolute right-0 top-0 h-full flex flex-col border-l border-[rgba(0,0,0,0.1)]" role="group" aria-label="Quantity controls">
                <Button
                    onClick={increment}
                    className="!min-w-[32px] !w-[32px] flex-1 !rounded-none !rounded-tr-md !text-gray-500 hover:!bg-red-50 hover:!text-red-500 !p-0 !border-none !bg-white"
                    aria-label="Increase quantity"
                    disabled={qty >= max}
                >
                    <FaAngleUp className="text-[11px]" aria-hidden="true" />
                </Button>
                <div className="border-t border-[rgba(0,0,0,0.1)]" />
                <Button
                    onClick={decrement}
                    disabled={qty <= min}
                    className="!min-w-[32px] !w-[32px] flex-1 !rounded-none !rounded-br-md !text-gray-500 hover:!bg-red-50 hover:!text-red-500 disabled:!text-gray-300 !p-0 !border-none !bg-white"
                    aria-label="Decrease quantity"
                >
                    <FaAngleDown className="text-[11px]" aria-hidden="true" />
                </Button>
            </div>

        </div>
    );
};

QtyBox.propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func,
    min: PropTypes.number,
    max: PropTypes.number,
};