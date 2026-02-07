import React from "react";
import SideBar from "../../Component/SideBar";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';



const Products = () => {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <section className="h-screen pb-0">
            <div className="bg-white p-2">
                <div className="my-container flex gap-3">
                    <div className="sidebarWrapper fixed -bottom-full left-0 w-fulllg:h-full lg:static lg:w-[20%] bg-white z-102 lg:z-100 p-3 lg:p-0  transition-all lg:opacity-100 opacity-0 ">
                        <SideBar />
                    </div>
                    <div className="rightContent w-full lg:w-[80%] py-3">
                        <div className="bg-[#f1f1f1] p-2 w-full mb-4 rounded-md flex items-center justify-between sticky top-33.75 z-99">
                            <div className="col2 ml-auto flex items-center justify-end gap-3 pr-4">
                                <span className="text-[14px] font-medium pl-3 text-[rgba(0,0,0,0.7)]">Sort By</span>
                                <Button className="bg-white! text-[12px]! text-black!"
                                    id="basic-button"
                                    aria-controls={open ? 'basic-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                    onClick={handleClick}>
                                    Name, A to Z
                                </Button>

                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    slotProps={{
                                        list: {
                                            'aria-labelledby': 'basic-button',
                                        },
                                    }}
                                >
                                    <MenuItem onClick={handleClose}>Name, A to Z</MenuItem>
                                    <MenuItem onClick={handleClose}>Name, Z to A</MenuItem>
                                    <MenuItem onClick={handleClose}>Price, Low To High</MenuItem>
                                    <MenuItem onClick={handleClose}>Price, High To Low</MenuItem>
                                </Menu>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Products;
