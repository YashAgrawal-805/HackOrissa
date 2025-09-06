import React, { useRef, useState } from 'react'
import Title from '../utility/Title'
import assets from '../assets/assets'
import toast from 'react-hot-toast'
import { motion } from "framer-motion";

const ContactUs = () => {

    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [visible, setVisible] = useState(false)
    const divRef = useRef(null)

    const handleMouseMove = (e) => {
        const bounds = divRef.current.getBoundingClientRect()
        setPosition({ x: e.clientX - bounds.left, y: e.clientY - bounds.top })
    }

    const onSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        formData.append("access_key", "--- Enter Web3Forms key ---");

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Thank you for your submission!')
                event.target.reset();
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.2 }}
            id='contact-us'
            className='flex flex-col items-center gap-7 px-4 sm:px-12 lg:px-24 xl:px-40 pt-30 text-gray-700 dark:text-white'
        >
            {/* Glass effect container with border glow */}
            <div
                ref={divRef}
                onMouseEnter={() => setVisible(true)}
                onMouseLeave={() => setVisible(false)}
                onMouseMove={handleMouseMove}
                className="relative w-full max-w-3xl backdrop-blur-2xl bg-white/20 dark:bg-black/20 border border-white/30 dark:border-white/10 rounded-2xl shadow-xl p-6 sm:p-10 flex flex-col items-center gap-7 overflow-hidden"
            >

                {/* Border Glow Effect */}
                <div
                    className={`pointer-events-none blur-3xl rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 absolute inset-0 z-10 transition-opacity duration-500 ${visible ? 'opacity-40' : 'opacity-0'}`}
                    style={{
                        background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(59,130,246,0.6), transparent 70%)`
                    }}
                />

                {/* Content */}
                <div className="relative z-20 w-full flex flex-col items-center gap-7">
                    <Title title='Reach out to us' desc='From strategy to execution, we craft digital solutions that move your business forward.' />

                    <motion.form
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        viewport={{ once: true }}
                        onSubmit={onSubmit}
                        className='grid sm:grid-cols-2 gap-3 sm:gap-5 max-w-2xl w-full'
                    >

                        <div>
                            <p className='mb-2 text-sm font-medium'>Your name</p>
                            <div className='flex pl-3 rounded-lg border border-gray-500 dark:border-gray-600'>
                                <img src={assets.person_icon} alt="" />
                                <input name="name" type="text" placeholder='Enter your name' className='w-full p-3 text-sm outline-none' required />
                            </div>
                        </div>

                        <div>
                            <p className='mb-2 text-sm font-medium'>Email id</p>
                            <div className='flex pl-3 rounded-lg border border-gray-500 dark:border-gray-600'>
                                <img src={assets.email_icon} alt="" />
                                <input name="email" type="email" placeholder='Enter your email' className='w-full p-3 text-sm outline-none' required />
                            </div>
                        </div>

                        <div className='sm:col-span-2'>
                            <p className='mb-2 text-sm font-medium'>Message</p>
                            <textarea name="message" rows={8} placeholder='Enter your message' className='w-full p-3 text-sm outline-none rounded-lg border border-gray-500 dark:border-gray-600' required />
                        </div>

                        <button type="submit" className='w-max flex gap-2 bg-primary text-white text-sm px-10 py-3 rounded-full cursor-pointer hover:scale-103 transition-all'>
                            Submit <img src={assets.arrow_icon} alt="" className='w-4' />
                        </button>

                    </motion.form>
                </div>
            </div>
        </motion.div>
    )
}

export default ContactUs
