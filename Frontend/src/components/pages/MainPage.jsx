
import React from 'react';
import Navbar from '../Navbar';
import Hero from '../Hero';
import Services from '../Services';
import Team from '../team/team';
import VantaNetBackground from '../Utilities/bg';
import ContactUs from '../ContactUs';
import Footer from '../Footer';

const MainPage = ({ theme, setTheme }) => {
  return (
    <>
      <VantaNetBackground theme={theme} />
      <Navbar theme={theme} setTheme={setTheme} />
      <Hero />
      <Services />
      <Team />
      <ContactUs />
      <Footer theme={theme} />
    </>
  );
};

export default MainPage;