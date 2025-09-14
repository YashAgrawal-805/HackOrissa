import React from 'react'
import assets from '../assets/assets'
import Title from '../utility/Title'
import ServiceCard from './cards/ServiceCard'
import { motion } from "framer-motion";

const Services = () => {

    const servicesData = [
        {
          title: 'Stay Connected,Stay Safe',
          description: 'Get instant alerts if any group member steps outside the safety radius.',
          icon: assets.ads_icon
        },
        {
          title: 'Find Your StayBuddy',
          description: 'Helping solo travelers connect and find reliable roommates during trips.',
          icon: assets.marketing_icon
        },
        {
            title: 'Plan Trip Like a Pro !',
            description: 'We design the smartest route based on the places you want to explore.',
            icon: assets.content_icon,
        },
         {
          title: 'Local Food Cuisine',
          description: 'Get local cuisine recommendations based on where you are.',
          icon: assets.marketing_icon
        },
        {
            title: 'SOS',
            description: 'Quick SOS alerts to your group and nearby traveller.',
            icon: assets.content_icon,
        },
        {
            title: 'Alert',
            description: 'Know before you go—safety notifications keep you protected.',
            icon: assets.social_icon,
        },
    ]

  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ staggerChildren: 0.2 }}
      id='services'
      className='relative flex flex-col items-center gap-7 px-4 sm:px-12 lg:px-24 xl:px-40 pt-30 text-gray-700 dark:text-white'
    >
        
        <img src={assets.bgImage2} alt="" className='absolute -top-110 -left-70 -z-1 dark:hidden'/>

        <Title title='How can we help?' desc='From strategy to execution, we craft digital solutions that move your business forward.'/>

        <div className='flex flex-col md:grid grid-cols-2'>
            {servicesData.map((service, index)=>(
                <ServiceCard key={index} service={service} index={index}/>
            ))}
        </div>

    </motion.div>
  )
}

export default Services