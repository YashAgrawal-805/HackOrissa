
import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Team from '../components/team/team';
import VantaNetBackground from '../Utilities/bg';
import ContactUs from '../components/ContactUs';
import Footer from '../components/Footer';

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