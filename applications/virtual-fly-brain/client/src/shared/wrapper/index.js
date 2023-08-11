import React from "react";
import MediaQuery from 'react-responsive';
import Header from "../header";
import SubHeader from "../subHeader";
import BottomNav from "../bottomNav";

const Wrapper = ({ children, setBottomNav, bottomNav }) => {
  return (
    <>
      <Header />
      <SubHeader bottomNav={bottomNav} setBottomNav={setBottomNav} />
      {children}
      <MediaQuery maxWidth={1199}>
        <BottomNav bottomNav={bottomNav} setBottomNav={setBottomNav} />
      </MediaQuery>
    </>
  )
};

export default Wrapper;