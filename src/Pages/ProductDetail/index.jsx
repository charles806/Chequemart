import { Rating } from "@mui/material";
import ProductZoom from "../../Component/ProductZoom";

const ProductDetail = () => {
    return (
        <section className="min-h-screen pb-8 md:pb-0 py-5 bg-white">
            <div className="my-container flex flex-col md:flex-row gap-8">
                <div className="productZoomContainer w-full md:w-[40%]">
                    <ProductZoom />
                </div>

                <div className="ProductContent w-full md:w-[60%]">
                    <h1 className="text-[25px] font-[600] mb-3 text-black">Barca Jersey</h1>
                    <div className="flex items-center gap-3">
                        <span className="text-gray-400">
                            Brands: <span className="font-[500] text-black opacity-75">Barca Jersey 23/24 season</span>
                        </span>

                        <Rating name="size-small" defaultValue={4} size="small" readOnly />
                        <span className="text-gray-400 text-[13px] cursor-pointer">
                            (4 reviews)
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductDetail;
