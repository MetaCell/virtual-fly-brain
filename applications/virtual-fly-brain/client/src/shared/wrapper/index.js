import React from "react";
import MediaQuery from 'react-responsive';
import Header from "../Header";
import SubHeader from "../SubHeader";
import BottomNav from "../BottomNav";

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