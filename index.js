const express = require("express");
const { video } = require("tiktok-scraper");
const app = express();

// Tiktok Scraper
const tiktok = require('tiktok-scraper');

let options = {
    headers: {
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.80 Safari/537.36",
        "referer": "https://www.tiktok.com/",
        "cookie": "tt_webid_v2=689854141086886123"
    },
    sessionList: ["sid_tt=92c5acd5030c241b26734271fbe78b34;"]
}

app.get("/", (req, res) => {
    res.send({
        status : 403,
        msg : "No Access Here :|"
    }).status(403);
})

app.get("/info", (req, res) => {
    if(!req.query.username || req.query.username == "") return res.status(400).send({
        status : 400,
        msg : "Need parameter username"
    })
    let username = decodeURIComponent(req.query.username);
    tiktok.getUserProfileInfo(username, options).then(data => {
        console.log(data.user);
        return res.send({
            id : data.user.id,
            nickname : data.user.nickname,
            description : data.user.signature,
            verified : data.user.verified,
            avatar : data.user.avatarMedium,
            url : `https://www.tiktok.com/@${data.user.uniqueId}`
        });
    }).catch(e => {
        console.log(e);
        return res.status(404).send({
            status : 404,
            msg : "Username Not Found"
        })
    })
})

app.get("/download", (req, res) => {
    if(!req.query.url || req.query.url == "") return res.status(400).send({
        status : 400,
        msg : "Need parameter url"
    })
    let url = decodeURIComponent(req.query.url);
    tiktok.getVideoMeta(url, options).then(videoMeta => {
        return res.send({
            //debug : videoMeta,
            Status: 200,
            Judul: videoMeta.collector[0].text,
            Like: videoMeta.collector[0].diggCount,
            Share: videoMeta.collector[0].shareCount,
            Comment: videoMeta.collector[0].CommentCount,
            Video_URL: {
                WithWM: videoMeta.collector[0].videoUrl
            }
        })
    }).catch(e => {
        return res.status(404).send({
            status : 404,
            msg : "Video Not Found"
        })
    })
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("Server Status Online On Port " + port);
})