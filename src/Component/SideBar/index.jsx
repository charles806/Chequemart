import Button from '@mui/material/Button'
import { FaAngleDown } from "react-icons/fa";


const SideBar = () => {
    return (
        <aside className="sidebar py-3  lg:py-5 static lg:sticky top-32.5 z-50 pr-0 lg:pr-5">
            <div className="sidebarScroll max-h-[60vh] lg:max-h-max lg:overflow-visible overflow-auto w-full">
                <div className="box">
                    <h3 className='w-full mb-3 text-[16px] font-semibold flex items-center pr-5'>Shop by Category</h3>

                </div>
                <Button className="w-7.5! h-7.5! min-w-7.5! rounded-full! ml-auto! text-black!">
                    <FaAngleDown />
                </Button>
            </div>
        </aside>
    )
}

export default SideBar