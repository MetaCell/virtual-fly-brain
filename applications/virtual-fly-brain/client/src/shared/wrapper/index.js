import React from "react";
import MediaQuery from 'react-responsive';
import Header from "../header";
import SubHeader from "../subHeader";
import BottomNav from "../bottomNav";

const Wrapper = ({ children }) => {
  return (
    <>
      <Header />
      <SubHeader />
      {children}
      <MediaQuery maxWidth={1199}>
        <BottomNav />
      </MediaQuery>
    </>
  )
};

export default Wrapper;