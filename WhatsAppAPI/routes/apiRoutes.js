import express from "express"
const router = express.Router();
import dotenv from 'dotenv'
import sendMessage from "../controllers/whatsappMessage.js";

dotenv.config()

router.get("/wether",async(req,res) => {
    const weatherResponse = await fetch(`http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API}&q=Mathura`);
    const weatherData = await weatherResponse.json();
    res.send(`Temperature in Celsius: ${weatherData.current.temp_c}`)
})

router.get("/news", async(req,res) => {
    const NewsResponse = await fetch(`https://newsapi.org/v2/top-headlines?q=elonmusk&apiKey=${process.env.NEWS_API}`)
    res.send(NewsResponse)
})

router.get("/whatsapp",async(req,res) => {
    await sendMessage('+919458016708', 'Hello')
})

export default router;