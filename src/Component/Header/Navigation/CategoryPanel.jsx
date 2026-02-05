import React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { IoClose } from "react-icons/io5";
import CategoryCollapse from "../../CategoryCollapse";

function CategoryPanel(props) {
  const toggleDrawer = (newOpen) => () => {
    props.setIsOpenCatPanel(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" className="bg-white min-h-screen flex flex-col">
      <div>

        {/* <div className="col1 w-[40%] lg:w-[25%] shrink-0!">
          <Link to="/">
            <img
              src={logo}
              alt="ChequeMart Logo"
              className="max-w-55 lg:max-w-50 h-auto"
            />
          </Link>
        </div> */}
        <h3 className="p-4 text-base font-semibold flex justify-between items-center border-b border-gray-200">
          Shop by Categories
          <IoClose
            onClick={toggleDrawer(false)}
            className="text-xl cursor-pointer"
          />
        </h3>

        <CategoryCollapse />
      </div>
    </Box>
  );

  return (
    <>
      <Drawer open={props.isOpenCatPanel} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </>
  );
}

export default CategoryPanel;
