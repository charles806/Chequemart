import React from "react";
import SideBar from "../../Component/SideBar";
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';

function handleClick(event) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
}


const Products = () => {
    return (
        <section className="h-screen pb-0">
            <div role="presentation" onClick={handleClick} className="mt-5">
                <Breadcrumbs aria-label="breadcrumb">
                    <Link underline="hover" color="inherit" href="/">
                        MUI
                    </Link>
                    <Link
                        underline="hover"
                        color="inherit"
                        href="/material-ui/getting-started/installation/"
                    >
                        Core
                    </Link>
                    <Typography sx={{ color: 'text.primary' }}>Breadcrumbs</Typography>
                </Breadcrumbs>
            </div>

            <div className="bg-white p-2">
                <div className="my-container flex gap-3">
                    <div className="sidebarWrapper fixed -bottom-full left-0 w-fulllg:h-full lg:static lg:w-[20%] bg-white z-102 lg:z-100 p-3 lg:p-0  transition-all lg:opacity-100 opacity-0 ">
                        <SideBar />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Products;
