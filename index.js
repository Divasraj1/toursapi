const express = require("express");
const request = require("request-promise");
const cheerio = require("cheerio");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());



async function akbartravels(){
    let packages = [];
    const html = await request.get("https://www.akbartravels.com/holidays/india-tour-packages/");
    const $ = cheerio.load(html);
    $("div.wrapper > div.right.clickable-card > div.top").map((index,element) =>{
        const title = $(element).find("div.left-content > h3:nth-child(1)").text();
        const duration = $(element).find("div.left-content > h3:nth-child(2) > span").text();
        const places = $(element).find("div.left-content > p").text();
        const farefor = $(element).find("div.fare.slashed-price > p").text();
        const fare = $(element).find("div.fare.slashed-price > h3").text();
        const link = $(element).find("div.fare.slashed-price > a").attr("href");
        const package = {
            title: title,
            duration : duration,
            places : places,
            farefor : farefor,
            fare : fare,
            link : link
        }
        packages.push(package);
    }).get();
    return packages;
}


async function main(){
    akbartravels();
}

app.get("/",(req,res) => {
    res.send("Welcome to tours api");
})

app.get("/tours",async (req,res) => {
    try{
        const packages = await akbartravels();
        res.json(packages);
    }
    catch(error){
        res.json(error);
    }
})

app.listen(PORT,() => console.log(`Server running on port ${PORT}`));