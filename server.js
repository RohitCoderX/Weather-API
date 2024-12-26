const express = require("express");
const cheerio = require("cheerio");
const axios = require("axios");
require("dotenv").config();  //requiring in config format

const app =express();

app.listen(process.env.PORT,()=>{
   console.log(`Server started`);
})
//API names defined in env file, just connect with process.env.name
app.get("/:city", async(req,res)=>{
    try {
    const page = await axios.get(process.env.SCRAPE_API_First +req.params.city + process.env.SCRAPE_API_Last); //joining the api
    //console.log(page.data);
    const $ = cheerio.load(page.data);  //Loading page, cheerio we are using for that
    const date = $(process.env.DATE_CLASS).text();   // Receiving class from date div via inspect converting to text
    const temp =$(process.env.TEMP_CLASS).text();  // we used same class from above api via div 
    const maxmintemp =$(process.env.MAX_MIN_CLASS).text();
    const humid = $(process.env.HUMID_CLASS).text();
    let mintemp ='';
    let maxtemp ='';
    let humidity ='';
    let pressure ='';
    //console.log(maxmintemp); // we are gtting all the values so we are applying for loop to fetch the data as per requirement
    for(let i=0;i<6;i++){
    if(i<3){
            mintemp = mintemp+maxmintemp[i];
           }
           else{
            maxtemp = maxtemp+maxmintemp[i];
           }
    }
    for(let i=0;i<6;i++){
        if(i<2){
            humidity = humidity+humid[i];
           }
           else{
            pressure =  pressure +humid[i];
           }
    }
    let weatherdata ={
        date,
        temp,
        mintemp,
        maxtemp,
        humidity,
        pressure
    };

    res.send(weatherdata);
}
catch(e)
{
    console.log(e);
}
})