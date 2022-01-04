//This was written by Spencer#0003 and partially by DaDude#3044.

require("dotenv").config();
const bodyParser = require("body-parser");
const Discord = require("discord.js");
const client = new Discord.Client();
const express = require("express");
const helmet = require("helmet");
const prefix = process.env.prefix;
const token = process.env.token;
const app = express();
const useragent = require("express-useragent");
const rateLimit = require("express-rate-limit");
const db = require("./users.json");
var redeemableKeys = require("./unusedkeys.json");
var data = require("./data.json");
const sha256 = require("js-sha256").sha256;
const fs = require("fs");
const commands = {};

client.once("ready", () => {
    client.user.setPresence({
        game: {
            name: "with keys",
            type: "PLAYING"
        },
    });
    client.user.setStatus("available");
});

function checkUserAgent(userAgent) {
    var ua = userAgent["source"];
    if (ua == "Roblox/WinInet" || ua == "" || ua == "sentinel" || ua == "SirHurtV4/WinInet" || ua.includes("synx")) {
        return true;
    };

    return false;
};

function addcommand(name, aliases, desc, usage, func) {
    commands[Object.keys(commands).length + 1] = { "Name": name, "Aliases": aliases, "Description": desc, "Usage": usage, "Function": func };
};

function fortable(table, func) {
    for (var p in table) {
        if (table.hasOwnProperty(p)) {
            func(p, table[p]);
        };
    };
};

function uniformRNG(a, b) {
    let a1 = 48718057,
        a2 = 58305628;

    let b1 = 108466472,
        b2 = 1090878788885;

    let x1 = a,
        x2 = b;

    let r1 = (x2 * a2);
    let r2 = (x1 * a2 + x2 * a1) % b1;
    r2 = (r2 * b1 + r2) % b2;

    x1 = Math.floor(r2 / b1);
    x2 = r2 - x1 * b1;

    return Math.round((r2 / b2) * Math.pow(10, 12));
};

function createWhitelist(length) {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;

    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    };

    return result;
};

const limiter = rateLimit({
    windowMs: 2 * 60 * 1000,
    max: 100,
    message: "Rate limited, cunt."
});

app.use(limiter);
app.use(helmet());
app.use(useragent.express());
app.use(bodyParser.json({ limit: "10kb" }));
app.use("/public", express.static("public"));

app.get("/", function(request, response) {
    response.send("edge hub kinda epic tbh");
});

app.post("/OEFGIpnzyCNtwg7scItD", function(request, response) {
    if (!checkUserAgent(request.useragent)) {
        return response.send("OOO YOU SO HORNY DADDDY!"); //If not using exploits.
    };

    let ip = (request.headers["x-forwarded-for"] || "").split(",")[0] || request.connection.remoteAddress;

    let key = request.body.c36cbe5311285b2c8cdacb88b4433b4ae4c36468e7cd63c8d76ebabbc6dcc;
    let result = "Invalid";
    let antiSpoof = 0;
    let exploit;
    let hwid;
    let discID;

    fortable(request.headers, function(i, v) {
        if (i == "syn-fingerprint") {
            hwid = v;
            exploit = "Synapse X";
            antiSpoof += 1;
        } else if (i == "sentinel-fingerprint") {
            hwid = v;
            exploit = "Sentinel";
            antiSpoof += 1;
        } else if (i == "proto-user-identifier") {
            hwid = v;
            exploit = "ProtoSmasher";
            antiSpoof += 1;
        };
    });

    if (hwid == "") {
        return response.send("YO MOM GAY!");
    };

    fortable(db, function(i, v) {
        if (Buffer.from(sha256(v.key)).toString("base64") == key) {
            if (v.hwid == "") {
                v.hwid = hwid;
                fs.writeFile(__dirname + "/users.json", JSON.stringify(db, null, 4), x => {
                    if (x) {
                        console.log(x);
                    };
                });
                result = "Valid";
            } else if (v.hwid == hwid) {
                result = "Valid";
            } else {
                result = "Mismatch";
            };
            return discID = i;
        };
    });

    if (antiSpoof > 1) {
        result = "Mismatch";
    };

    let osTime = new Date();
    let dynamic = (Math.round(osTime.getTime() / 1000)).toString();
    dynamic = dynamic.split("");
    delete dynamic[9];
    delete dynamic[8];

    if (result == "Valid") {
        let res = sha256(db[discID].key + uniformRNG(dynamic[6], dynamic[7]).toString());
        let channel = client.channels.get("708073613529710632");
        let validMessage = new Discord.RichEmbed()
            .setColor("#00ff00")
            .setTitle("Valid login")
            .addField("User", client.users.get(discID))
            .addField("Key", db[discID].key, true)
            .addField("IP", ip, true)
            .addField("Exploit", exploit)
            .addField("HWID", hwid)
            .setThumbnail("https://media.discordapp.net/attachments/521768610029633549/708034002254299156/keklul.png")
            .setFooter("Epic");
        channel.send(validMessage);
        return response.send(res);
    } else if (result == "Mismatch") {
        let channel = client.channels.get("708286404396056688");
        let mismatchMessage = new Discord.RichEmbed()
            .setColor("#ff0000")
            .setTitle("HWID Mismatch")
            .addField("User", client.users.get(discID))
            .addField("Key", db[discID].key, true)
            .addField("IP", ip, true)
            .addField("Exploit", exploit)
            .addField("HWID", hwid)
            .addField("Expected HWID", db[discID].hwid)
            .setThumbnail("https://media.discordapp.net/attachments/521768610029633549/708034002254299156/keklul.png")
            .setFooter("Epic");
        channel.send(mismatchMessage);
        return response.send("HWID Mismatch");
    } else if (result == "Invalid") {
        let channel = client.channels.get("701261958770589728");
        let invalidMessage = new Discord.RichEmbed()
            .setColor("#ff0000")
            .setTitle("Invalid Attempt")
            .addField("User", client.users.get(discID))
            .addField("Hashed Key", key, true)
            .addField("IP", ip, true)
            .addField("Exploit", exploit)
            .addField("HWID", hwid)
            .setThumbnail("https://media.discordapp.net/attachments/521768610029633549/708034002254299156/keklul.png")
            .setFooter("Epic");
        channel.send(invalidMessage);
        return response.send("Invalid");
    };
});

app.get("/:Exploit/getscript", function(request, response) {
    if (!checkUserAgent(request.useragent)) {
        return response.send("epic");
    };

    if (request.params.Exploit == "Synapse") {
        return response.send(fs.readFileSync("./public/SynapseScript.lua", "utf-8"));
    } else if (request.params.Exploit == "Sentinel") {
        return response.send(fs.readFileSync("./public/SentinelScript.lua", "utf-8"));
    } else if (request.params.Exploit == "ProtoSmasher") {
        return response.send(fs.readFileSync("./public/ProtoSmasher.lua", "utf-8"));
    };

    return response.send("Invalid exploit");
});

app.get("/onlygaypeopleknowaboutthisurl", function(request, response) {
    if (!checkUserAgent(request.useragent)) {
        return response.send("true");
    };
    return response.send(JSON.parse(data).ScriptEnabled);
});

app.listen(3005);

addcommand("Get Script", ["getscript"], "Gives a whitelisted user the script", prefix + "getscript", function(message) {
    if (db[message.author.id]) {
        let embed = new Discord.RichEmbed() 
            .setColor("#0099ff")
            .setTitle("Edge Hub: Script")      
            .setThumbnail("https://cdn.discordapp.com/attachments/706535183532425246/708771829187215490/favicon.png")     
            .addField("Script", "```lua\npcall(function()\nshared.whitelistkey = '" + db[message.author.id].key + "';\nlocal exploit = (syn and 'Synapse') or (pebc_execute and 'ProtoSmasher') or (secure_load and 'Sentinel');\nloadstring(game:HttpGet('https://icee.online/edge/'..exploit..'/getscript'))();\nend);```", true) 
            .setFooter("icee is epic!"); 
        message.author.send(embed);
        let embed2 = new Discord.RichEmbed()
            .setColor("#0099ff")
            .setTitle("ICEE Bot")     
            .setThumbnail("https://cdn.discordapp.com/attachments/706535183532425246/708771829187215490/favicon.png")     
            .setDescription("I've sent the info in DMS.") 
            .setFooter("icee is epic!");
        message.reply(embed2);
    } else {
        let embed9 = new Discord.RichEmbed()
            .setColor("#0099ff")
            .setTitle("ICEE Bot")     
            .setThumbnail("https://cdn.discordapp.com/attachments/706535183532425246/708771829187215490/favicon.png")     
            .setDescription("You are not whitelisted") 
            .setFooter("icee is epic!");
        message.reply(embed9);
    };
});

addcommand("Help", ["help"], "Help", prefix + "help", function(message) {
    let embedj = new Discord.RichEmbed()
    .setColor("#0099ff")
    .setTitle("ICEE Bot")     
    .setThumbnail("https://cdn.discordapp.com/attachments/706535183532425246/708771829187215490/favicon.png")     
    .setDescription("Read #how-to-whitelist") 
    .setFooter("icee is epic!");
    message.reply(embedj);
})

addcommand("whitelist", ["whitelist"], "Whitelists the specified user", prefix + "whitelist", function(message) {
    if (message.author.id !== "519790100956184586" && message.author.id !== "701202484097581146") {
        let embed0 = new Discord.RichEmbed()
        .setColor("#0099ff")
        .setTitle("ICEE Bot")     
        .setThumbnail("https://cdn.discordapp.com/attachments/706535183532425246/708771829187215490/favicon.png")     
        .setDescription("You are not authorised to run this command.") 
        .setFooter("icee is epic!");
        return message.reply(embed0);
    };

    let toWhitelist = message.content.split(" ")[1];
    let buyerRole = message.guild.roles.get("701207935166185475");

    if (!db[toWhitelist]) {
        db[toWhitelist] = {
            key: "key_" + createWhitelist(12),
            hwid: ""
        };
    };

    fs.writeFile(__dirname + "/users.json", JSON.stringify(db, null, 4), x => {
        if (x) {
            return message.channel.send({
                embed: {
                    title: "ICEE's Bot: Error",
                    color: 0x0082ff,
                    fields: [{
                        name: "An error has occured",
                        value: x,
                        timestamp: new Date(),
                    }],
                    footer: {
                        text: "Made by Spencer#0003",
                    },
                    thumbnail: { url: "https://cdn.discordapp.com/avatars/708019913989685338/6ef7f5ebec7034640b4f240cba46380f.png" },
                },
            });
        };
    });

    message.guild.members.get(toWhitelist).addRole(buyerRole);
    message.channel.send("<@" + toWhitelist + "> has been whitelisted!");
});

addcommand("blacklist", ["blacklist"], "Blacklists the specified user", prefix + "blacklist", function(message) {
    if (message.author.id !== "519790100956184586" && message.author.id !== "701202484097581146") {
        return message.reply("You are not authorised to run this command.");
    };

    let toBlacklist = message.content.split(" ")[1];
    let buyerRole = message.guild.roles.get("701207935166185475");

    if (db[toBlacklist]) {
        delete db[toBlacklist];
    };

    fs.writeFile(__dirname + "/users.json", JSON.stringify(db, null, 4), x => {
        if (x) {
            return message.channel.send({
                embed: {
                    title: "ICEE's Bot: Error",
                    color: 0x0082ff,
                    fields: [{
                        name: "An error has occured",
                        value: x,
                        timestamp: new Date(),
                    }],
                    footer: {
                        text: "Made by Spencer#0003",
                    },
                    thumbnail: { url: "https://cdn.discordapp.com/avatars/708019913989685338/6ef7f5ebec7034640b4f240cba46380f.png" },
                },
            });
        };
    });

    message.guild.members.get(toBlacklist).removeRole(buyerRole);
    return message.channel.send("<@" + toBlacklist + "> has been blacklisted!");
});


addcommand("getrole", ["getrole"], "Gets the buyer Role", prefix + "getrole", function(message) {
    if (message.member.roles.has("701207935166185475")) {
        let embed3 = new Discord.RichEmbed()
        .setColor("#0099ff")
        .setTitle("ICEE Bot")     
        .setThumbnail("https://cdn.discordapp.com/attachments/706535183532425246/708771829187215490/favicon.png")     
        .setDescription("Already a buyer") 
        .setFooter("icee is epic!");
        return message.reply(embed3);
    };
    if (db[message.author.id]) {
        message.member.addRole("701207935166185475");
        let embed2 = new Discord.RichEmbed()
        .setColor("#0099ff")
        .setTitle("ICEE Bot")     
        .setThumbnail("https://cdn.discordapp.com/attachments/706535183532425246/708771829187215490/favicon.png")     
        .setDescription("Just gave you buyers role!") 
        .setFooter("icee is epic!");
        message.reply(embed2);
    } else {
        let embedv = new Discord.RichEmbed()
        .setColor("#0099ff")
        .setTitle("ICEE Bot")     
        .setThumbnail("https://cdn.discordapp.com/attachments/706535183532425246/708771829187215490/favicon.png")     
        .setDescription("You're not a buyer") 
        .setFooter("icee is epic!");
        message.reply(embedv);
    };
})


addcommand("redeem", ["redeem"], "Redeem your key.", prefix + "redeeem", function(message) {
    let keyToUse = message.content.split(" ")[1];

    if (db[message.author.id]) {
        let embedg = new Discord.RichEmbed()
        .setColor("#0099ff")
        .setTitle("ICEE Bot")     
        .setThumbnail("https://cdn.discordapp.com/attachments/706535183532425246/708771829187215490/favicon.png")     
        .setDescription("You already a buyer.") 
        .setFooter("icee is epic!");
        return message.reply(embedg);
    };

    if (redeemableKeys[keyToUse] && redeemableKeys[keyToUse].redeemed !== "true") {
        redeemableKeys[keyToUse].redeemed = "true";

        fs.writeFile(__dirname + "/unusedkeys.json", JSON.stringify(redeemableKeys, null, 4), x => {
            if (x) {
                return message.channel.send({
                    embed: {
                        title: "ICEE's Bot: Error",
                        color: 0x0082ff,
                        fields: [{
                            name: "An error has occured",
                            value: x,
                            timestamp: new Date(),
                        }],
                        footer: {
                            text: "Made by Spencer#0003",
                        },
                        thumbnail: { url: "https://cdn.discordapp.com/avatars/708019913989685338/6ef7f5ebec7034640b4f240cba46380f.png" },
                    },
                });
            };
        });

        db[message.author.id] = {
            key: "key_" + createWhitelist(12),
            hwid: "",
        };

        fs.writeFile(__dirname + "/users.json", JSON.stringify(db, null, 4), x => {
            if (x) {
                return message.channel.send({
                    embed: {
                        title: "ICEE's Bot: Error",
                        color: 0x0082ff,
                        fields: [{
                            name: "An error has occured",
                            value: x,
                            timestamp: new Date(),
                        }],
                        footer: {
                            text: "Made by Spencer#0003",
                        },
                        thumbnail: { url: "https://cdn.discordapp.com/avatars/708019913989685338/6ef7f5ebec7034640b4f240cba46380f.png" },
                    },
                });
            };
        });
        let embedz = new Discord.RichEmbed()
        .setColor("#0099ff")
        .setTitle("ICEE Bot")     
        .setThumbnail("https://cdn.discordapp.com/attachments/706535183532425246/708771829187215490/favicon.png")     
        .setDescription("You have been whitelisted, enjoy Edge Hub!") 
        .setFooter("icee is epic!");
        return message.reply(embedz);
    } else {
        let embednb = new Discord.RichEmbed()
        .setColor("#0099ff")
        .setTitle("ICEE Bot")     
        .setThumbnail("https://cdn.discordapp.com/attachments/706535183532425246/708771829187215490/favicon.png")     
        .setDescription("This key is either invalid or has been already redeemed.") 
        .setFooter("icee is epic!");
        return message.reply(embednb);
    };
});

addcommand("keygen", ["keygen", "keyg"], "Generate keys.", prefix + "keygen", function(message) {
    if (message.author.id !== "519790100956184586" && message.author.id !== "701202484097581146") {
        return message.reply("You are not authorised to run this command.");
    };

    let amount;
    let createdKeys = {};

    try {
        amount = parseInt(message.content.split(" ")[1]);
    } catch (err) {
        return message.reply("invalid amount parsed");
    };

    for (i = 0; i < amount; i++) {
        let newKey = "key_" + createWhitelist(12);

        redeemableKeys[newKey] = {
            "redeemed": "false"
        };

        fs.writeFile(__dirname + "/unusedkeys.json", JSON.stringify(redeemableKeys, null, 4), x => {
            if (x) {
                return message.channel.send({
                    embed: {
                        title: "ICEE's Bot: Error",
                        color: 0x0082ff,
                        fields: [{
                            name: "An error has occured",
                            value: x,
                            timestamp: new Date(),
                        }],
                        footer: {
                            text: "Made by Spencer#0003",
                        },
                        thumbnail: { url: "https://cdn.discordapp.com/avatars/708019913989685338/6ef7f5ebec7034640b4f240cba46380f.png" },
                    },
                });
            };
        });

        message.channel.send("Key: " + newKey)
    };



    message.reply("I have generated " + amount.toString() + " keys!\n");
});

addcommand("keydelete", ["keydelete", "keyd"], "Delete the specified key.", prefix + "keydelete", function(message) {
    if (message.author.id !== "519790100956184586" && message.author.id !== "701202484097581146") {
        return message.reply("You are not authorised to run this command.");
    };

    let key = message.content.split(" ")[1];

    if (key == "all") {
        redeemableKeys = {};

        fs.writeFile(__dirname + "/unusedkeys.json", JSON.stringify(redeemableKeys, null, 4), x => {
            if (x) {
                return message.channel.send({
                    embed: {
                        title: "ICEE's Bot: Error",
                        color: 0x0082ff,
                        fields: [{
                            name: "An error has occured",
                            value: x,
                            timestamp: new Date(),
                        }],
                        footer: {
                            text: "Made by Spencer#0003",
                        },
                        thumbnail: { url: "https://cdn.discordapp.com/avatars/708019913989685338/6ef7f5ebec7034640b4f240cba46380f.png" },
                    },
                });
            };
        });
    } else {
        if (redeemableKeys[key]) {
            delete redeemableKeys[key]

            fs.writeFile(__dirname + "/unusedkeys.json", JSON.stringify(redeemableKeys, null, 4), x => {
                if (x) {
                    return message.channel.send({
                        embed: {
                            title: "ICEE's Bot: Error",
                            color: 0x0082ff,
                            fields: [{
                                name: "An error has occured",
                                value: x,
                                timestamp: new Date(),
                            }],
                            footer: {
                                text: "Made by Spencer#0003",
                            },
                            thumbnail: { url: "https://cdn.discordapp.com/avatars/708019913989685338/6ef7f5ebec7034640b4f240cba46380f.png" },
                        },
                    });
                };
            });
        } else {
            return message.reply("that is an invalid key.");
        };
    };

    if (key == "all") {
        message.reply("I have deleted all keys");
    } else {
        message.reply("I have deleted " + key + ".");
    };
});

addcommand("keys", ["keys"], "Shows all redeemable keys.", prefix + "keys", function(message) {
    if (message.author.id !== "519790100956184586" && message.author.id !== "701202484097581146") {
        return message.reply("You are not authorised to run this command.");
    };

    let desc = "";

    if (Object.keys(redeemableKeys).length > 0) {
        fortable(redeemableKeys, function(i, v) {
            if (v.redeemed == "false") {
                desc += "\n" + i;
            };
        });
        return message.channel.send(desc);
    } else {
        message.reply("there are 0 redeemable keys.");
    };
});

addcommand("buy", ["buy"], "Gives you the purchase link.", prefix + "buy", function(message) {
    let embedbhg = new Discord.RichEmbed()
    .setColor("#0099ff")
    .setTitle("ICEE Bot")  
    .setThumbnail("https://cdn.discordapp.com/attachments/706535183532425246/708771829187215490/favicon.png")     
    .setDescription("https://icee.online/") 
    .setFooter("icee is epic!");
    return message.reply(embedbhg);
});

addcommand("key", ["key", "info"], "Gives you your key.", prefix + "key", function(message) {
    if (db[message.author.id]) {
        message.author.send("Your key is " + db[message.author.id].key);
    } else {
        message.reply("you are not whitelisted.");
    };
});

addcommand("search", ["search"], "Searches for a user in the database.", prefix + "search", function(message) {
    let user = message.content.split(" ")[1];
    if (db[user]) {
        let hwid;
        if (db[user].hwid == "") {
            hwid = "N/A";
        } else {
            hwid = db[user].hwid;
        };
        return message.channel.send("<@" + user + ">'s info:\nHWID: " + hwid + "\nKey: " + db[user].key);
    };
});

addcommand("killscript", ["killscript"], "Stops the script from being executed.", prefix + "killscript", function(message) {
    if (message.author.id !== "519790100956184586" && message.author.id !== "701202484097581146") {
        return message.reply("You are not authorised to run this command.");
    };

    let choice = message.content.split(" ")[1];

    if (choice !== "true" && choice !== "false") {
        return message.reply("you have made an invalid choice.")
    };

    data.ScriptEnabled = choice;

    fs.writeFile(__dirname + "/data.json", JSON.stringify(data, null, 4), x => {
        if (x) {
            return message.channel.send({
                embed: {
                    title: "ICEE's Bot: Error",
                    color: 0x0082ff,
                    fields: [{
                        name: "An error has occured",
                        value: x,
                        timestamp: new Date(),
                    }],
                    footer: {
                        text: "Made by Spencer#0003",
                    },
                    thumbnail: { url: "https://cdn.discordapp.com/avatars/708019913989685338/6ef7f5ebec7034640b4f240cba46380f.png" },
                },
            });
        };
    });

    if (data.scriptEnabled == "true") {
        return message.reply("I have activated the killswitch!");
    } else {
        return message.reply("I have deactivated the killswitch!");
    }
});

addcommand("getwl", ["getwl"], "Transfer your whitelist to the new database :slight_smile", prefix + "getwl", function(message) {
    if (message.member.roles.has("701207935166185475")) {
        if (db[message.author.id]) {
            let embed2 = new Discord.RichEmbed()
            .setColor("#0099ff")
            .setTitle("ICEE Bot")  
            .setThumbnail("https://cdn.discordapp.com/attachments/706535183532425246/708771829187215490/favicon.png")     
            .setDescription("Whitelist already transferred.") 
            .setFooter("icee is epic!");
            return message.reply(embed2);
        } else {
            db[message.author.id] = {
                key: "key_" + createWhitelist(12),
                hwid: ""
            };

            fs.writeFile(__dirname + "/users.json", JSON.stringify(db, null, 4), x => {
                if (x) {
                    return message.channel.send({
                        embed: {
                            title: "ICEE's Bot: Error",
                            color: 0x0082ff,
                            fields: [{
                                name: "An error has occured",
                                value: x,
                                timestamp: new Date(),
                            }],
                            footer: {
                                text: "Made by Spencer#0003",
                            },
                            thumbnail: { url: "https://cdn.discordapp.com/avatars/708019913989685338/6ef7f5ebec7034640b4f240cba46380f.png" },
                        },
                    });
                };
            });

            let embed4 = new Discord.RichEmbed()
            .setColor("#0099ff")
            .setTitle("ICEE Bot")  
            .setThumbnail("https://cdn.discordapp.com/attachments/706535183532425246/708771829187215490/favicon.png")     
            .setDescription("Whitelist transferred!")
            .setFooter("icee is epic!");
            return message.reply(embed4);
        };
    };
});

addcommand("resethwid", ["resethwid"], "Resets your hardware ID.", prefix + "resethwid", function(message) {
    if (db[message.author.id]) {
        if (db[message.author.id].hwid !== "") {
            db[message.author.id].hwid = "";

            fs.writeFile(__dirname + "/users.json", JSON.stringify(db, null, 4), x => {
                if (x) {
                    return message.channel.send({
                        embed: {
                            title: "ICEE's Bot: Error",
                            color: 0x0082ff,
                            fields: [{
                                name: "An error has occured",
                                value: x,
                                timestamp: new Date(),
                            }],
                            footer: {
                                text: "Made by Spencer#0003",
                            },
                            thumbnail: { url: "https://cdn.discordapp.com/avatars/708019913989685338/6ef7f5ebec7034640b4f240cba46380f.png" },
                        },
                    });
                };
            });
            let embed2 = new Discord.RichEmbed()
            .setColor("#0099ff")
            .setTitle("ICEE Bot")  
            .setThumbnail("https://cdn.discordapp.com/attachments/706535183532425246/708771829187215490/favicon.png")     
            .setDescription("I just reset your HWID") 
            .setFooter("icee is epic!");
            message.reply(embed2);

        } else {
            let embed7 = new Discord.RichEmbed()
            .setColor("#0099ff")
            .setTitle("ICEE Bot")  
            .setThumbnail("https://cdn.discordapp.com/attachments/706535183532425246/708771829187215490/favicon.png")     
            .setDescription("you do not have a HWID set.") 
            .setFooter("icee is epic!");
            message.reply(embed7);
        }
    }
});

client.on("message", message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    let command = message.content.split(" ")[0];
    command = command.slice(prefix.length).toLowerCase()
    fortable(commands, function(__, v) {
        fortable(v.Aliases, function(__, i) {
            if (i == command) {
                try {
                    v.Function(message);
                } catch (error) {
                    return message.channel.send("Error: " + error);
                };
                return;
            };
        });
    });
});

client.login(token);
