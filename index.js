const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
var Long = require("long");
const unirest = require("unirest");
function roleC(message, role, desc, color) {
    message.guild.roles.create({
        data: {
          name: role,
          color: color,
        },
        reason: desc,
      })
        .then(console.log)
        .catch(console.error);
}

const {
    prefix, token, gifToken
}=require('./config.json');
client.data = require('./servers.json');
client.xp = require('./xp.json');
client.mute = require('./mutes.json');
client.on('message', message => {
    var msg = message.content.toLowerCase();
    let _con = client.data[message.guild.id].prefix;
    var id = message.guild.id;
    if(msg.startsWith(_con+'mute324224424')) {
        const args = message.content.slice(_con.length+4).trim().split(/ +/g);
        if(message.member.hasPermission('KICK_MEMBERS')) {
            if(args[0]) {
                if(args[1]) {
                    if(!message.guild.me.hasPermission('ADMINISTRATOR')) return sendEmbed(message, message.channel.name, "Missing Permissions", "I don't have the required permissions to operate(ADMINISTRATOR)");
                    const toKick = message.mentions.members.first() || message.guild.members.get(args[0]);
                    var user = toKick.id;
                    if(!toKick) {
                        return message.channel.send('The mentioned user does not exist');
                    }
                    if(message.author.id === toKick.id) {
                        return message.channel.send('You can not mute yourself');
                    }
                    if(toKick.hasPermission('KICK_MEMBERS')) {
                        return message.channel.send('I am not able to mute this person.');
                    }
                    const reason = args.slice(args[0].length);
                    if(!client.mute[id]) {
                        client.mute[id] = {
                        }
                    }
                    if(!client.mute[id][user]) {
                        client.mute[id][user] = {
                            muted: 'false',
                            reason: 'none',
                            by: 'none',
                            when: 'none'
                        }
                    }
                    if(client.mute[id][user].muted === 'true') {
                        return message.channel.send('This user is already muted!');
                    }
                    client.mute[id][user] = {
                        muted: 'true',
                        reason: reason,
                        by: message.author.tag,
                        when: message.createdAt.toString()
                    }
                    const embed = new Discord.MessageEmbed()
                    .setTitle(args[0]+ " has been muted!")
                    .setDescription('Reason: ' + reason)
                    .setColor('#ff2ec7')
                    .setFooter('By: ' + message.author.tag);
                    message.channel.send(embed);
                    message.delete();
                    fs.writeFile("./mutes.json", JSON.stringify (client.mute, null, 4), err => {
                        if(err) throw err;
                    });
                } else {
                    message.channel.send('You need to provide a reason!');
                }
            } else {
                message.channel.send('You need to mention somebody!');
            }
        } else {
            message.channel.send('You do not have the required permission.(KICK_MEMBERS)');
        }
    }
    if(msg.startsWith(_con+'unmute324224424')) {
        const args = message.content.slice(_con.length+6).trim().split(/ +/g);
        if(message.member.hasPermission('KICK_MEMBERS')) {
            if(args[0]) {
                if(args[1]) {
                    if(!message.guild.me.hasPermission('MANAGE_ROLES')) return sendEmbed(message, message.channel.name, "Missing Permissions", "I don't have the required permissions to operate(ADMINISTRATOR)");
                    const toKick = message.mentions.members.first() || message.guild.members.get(args[0]);
                    var user = toKick.id;
                    if(!toKick) {
                        return message.channel.send('The mentioned user does not exist');
                    }
                    const reason = args.slice(args[0].length);
                    if(!client.mute[id]) {
                        client.mute[id] = {
                        }
                    }
                    if(client.mute[id][user].muted === 'false' || !client.mute[id][user]) {
                        return message.channel.send('This user is not muted!');
                    }
                    client.mute[id][user] = {
                        muted: 'false',
                        reason: reason,
                        by: message.author.tag,
                        when: message.createdAt.toString()
                    }
                    const embed = new Discord.MessageEmbed()
                    .setTitle(args[0]+ " has been unmuted!")
                    .setDescription('Reason: ' + message.content.slice(6+toKick.length).split(" "))
                    .setColor('#ff2ec7')
                    .setFooter('By: ' + message.author.tag);
                    message.channel.send(embed);
                    message.delete();
                    fs.writeFile("./mutes.json", JSON.stringify (client.mute, null, 4), err => {
                        if(err) throw err;
                    });
                } else {
                    message.channel.send('You need to provide a reason!');
                }
            } else {
                message.channel.send('You need to mention somebody!');
            }
        } else {
            message.channel.send('You do not have the required permission.(KICK_MEMBERS)');
        }
    }

});
const getDefaultChannel = (guild) => {
    // get "original" default channel
    if(guild.channels.cache.has(guild.id))
      return guild.channels.cache.get(guild.id)
  
    // Check for a "general" channel, which is often default chat
    const generalChannel = guild.channels.cache.find(channel => channel.name === "general");
    if (generalChannel)
      return generalChannel;
    // Now we get into the heavy stuff: first channel in order where the bot can speak
    // hold on to your hats!
    return guild.channels.cache
     .filter(c => c.type === "text" &&
       c.permissionsFor(guild.client.user).has("SEND_MESSAGES"))
     .sort((a, b) => a.position - b.position ||
       Long.fromString(a.id).sub(Long.fromString(b.id)).toNumber())
     .first();
  }
  const activities_list = [
    "Thanks for having me.", 
    "WHOOP WHOOP",
    "証拠ちゃん可愛い", 
    "Shibuya-chan is cute af",
    ' made by Kogeki *uwu*',
    "animal crossing: hello world",
    "*uwu*",
    "日本人ですか?"
    ]
client.on("ready", ()=> {
    console.log("Logged in as " + client.user.tag);
    setInterval(() => {
        const index = Math.floor(Math.random() * (activities_list.length - 1) + 1); // generates a random number between 1 and the length of the activities array list (in this case 5).
        client.user.setActivity(activities_list[index]); // sets bot's activities to one of the phrases in the arraylist.
    }, 5000);
});

client.on('message', message=> {
    var id = message.guild.id;
    var user = message.author.id;
    let xpAdd = Math.floor(Math.random() * 3) + 7;
    if(!message.author.bot) {
        if(client.data[id].levelsystem === 'true') {
            if(!message.content.startsWith(client.data[id].prefix)) {
                if(!client.xp[id]) {
                    client.xp[id] = {

                    }
                    fs.writeFile("./xp.json", JSON.stringify (client.xp, null, 4), err => {
                        if(err) throw err;
                    });
                }
                if(!client.xp[id][user]) {
                    client.xp[id][user] = {
                        xp: 0,
                        level: 1
                    }
                    fs.writeFile("./xp.json", JSON.stringify (client.xp, null, 4), err => {
                        if(err) throw err;
                    });
                    sendEmbed(message, client.data[id].levelchannel, "Level data", message.author.username + "'s account has been inserted into database");
                   
                }
                
                let curxp =  client.xp[id][user].xp;
                let curlvl = client.xp[id][user].level;
                let nextlvl = client.xp[id][user].level * 500;
                client.xp[id][user].xp = curxp + xpAdd;
                if(nextlvl <= client.xp[id][user].xp) {
                    client.xp[id][user].level = curlvl + 1;
                    let lvlup = new Discord.MessageEmbed()
                    .setColor('#FF69B4')
                    .setTitle('Level Up')
                    .setDescription(message.author.username+' is now level ' + client.xp[id][user].level);
                    const channel = message.guild.channels.cache.find(c => c.name === client.data[id].levelchannel);
                    if(channel) {
                        channel.send(lvlup);
                    }
                }
                if(client.xp[id][user].level === 5) {
                    if(message.guild.roles.cache.find(r => r.name === 'Level 5')) {
                        if(!message.guild.me.hasPermission('MANAGE_ROLES')) return sendEmbed(message, message.channel.name, "Missing Permissions", "I don't have the required permissions to operate(MANAGE_ROLES)");
                        message.member.roles.add(message.guild.roles.cache.find(r => r.name === 'Level 5'));
                    } else {
                        sendEmbed(member, getDefaultChannel(member.guild), "Level role", "**WARNING**: The Level 5 role is missing! Please create one or *reset* to manage it!")
                    }
                }
                if(client.xp[id][user].level === 10) {
                    if(message.guild.roles.cache.find(r => r.name === 'Level 10')) {
                        if(!message.guild.me.hasPermission('MANAGE_ROLES')) return sendEmbed(message, message.channel.name, "Missing Permissions", "I don't have the required permissions to operate(MANAGE_ROLES)");
                        message.member.roles.add(message.guild.roles.cache.find(r => r.name === 'Level 10'));
                    } else {
                        sendEmbed(member, getDefaultChannel(member.guild), "Level role", "**WARNING**: The Level 10 role is missing! Please create one or *reset* to manage it!")
                    }
                }
                if(client.xp[id][user].level === 20) {
                    if(message.guild.roles.cache.find(r => r.name === 'Level 20')) {
                        if(!message.guild.me.hasPermission('MANAGE_ROLES')) return sendEmbed(message, message.channel.name, "Missing Permissions", "I don't have the required permissions to operate(MANAGE_ROLES)");
                        message.member.roles.add(message.guild.roles.cache.find(r => r.name === 'Level 20'));
                    } else {
                        sendEmbed(member, getDefaultChannel(member.guild), "Level role", "**WARNING**: The Level 20 role is missing! Please create one or *reset* to manage it!")
                    }
                }
                if(client.xp[id][user].level === 30) {
                    if(message.guild.roles.cache.find(r => r.name === 'Level 30')) {
                        if(!message.guild.me.hasPermission('MANAGE_ROLES')) return sendEmbed(message, message.channel.name, "Missing Permissions", "I don't have the required permissions to operate(MANAGE_ROLES)");
                        message.member.roles.add(message.guild.roles.cache.find(r => r.name === 'Level 30'));
                    } else {
                        sendEmbed(member, getDefaultChannel(member.guild), "Level role", "**WARNING**: The Level 30 role is missing! Please create one or *reset* to manage it!")
                    }
                }
                if(client.xp[id][user].level === 40) {
                    if(message.guild.roles.cache.find(r => r.name === 'Level 40')) {
                        if(!message.guild.me.hasPermission('MANAGE_ROLES')) return sendEmbed(message, message.channel.name, "Missing Permissions", "I don't have the required permissions to operate(MANAGE_ROLES)");
                        message.member.roles.add(message.guild.roles.cache.find(r => r.name === 'Level 40'));
                    } else {
                        sendEmbed(member, getDefaultChannel(member.guild), "Level role", "**WARNING**: The Level 40 role is missing! Please create one or *reset* to manage it!")
                    }
                }
                if(client.xp[id][user].level === 50) {
                    if(message.guild.roles.cache.find(r => r.name === 'Level 50')) {
                        if(!message.guild.me.hasPermission('MANAGE_ROLES')) 
                        sendEmbed(message, message.channel.name, "Missing Permissions", "I don't have the required permissions to operate(MANAGE_ROLES)");
                        message.member.roles.add(message.guild.roles.cache.find(r => r.name === 'Level 50'));
                    } else {
                        sendEmbed(message, getDefaultChannel(message.guild), "Level role", "**WARNING**: The Level 50 role is missing! Please create one or *reset* to manage it!")
                    }
                }
                fs.writeFile("./xp.json", JSON.stringify (client.xp, null, 4), err => {
                    if(err) throw err;
                });

            }
        }
    }
});

client.on("message", message => {
    if(message.author.id === '232186922812833792') {
        if(message.content.startsWith('-S')) {
            message.channel.send("Shutting down")
            .then(client.destroy());
        }
    } else {
        if(message.content.startsWith('-S')) { 
            message.channel.send("You are not permitted to do that.");
        }
    }
});
client.on("message", message => {
    //define all needed data
    var id = message.guild.id;
    var msg = message.content.toLowerCase();
    //double check for settings of the server
    if(!client.data[id]) {
        client.data[id] = {
            prefix: '.',
            logs: 'false',
            music: 'false',
            welcome: 'false',
            nsfw: 'false',
            editrole: 'admin',
            defaultrole: 'false',
            welcomechannel: 'welcome',
            levelsystem: 'false',
            levelchannel: 'level-up'
        }
        //write to the json
        fs.writeFile("./servers.json", JSON.stringify (client.data, null, 4), err => {
            if(err) throw err;
        });
        sendEmbed(message.channel.name, 'Settings', 'The server has been inserted into database, please try again.');
       
    }
    let _con = client.data[id].prefix;
    //help command
    if(msg.startsWith(_con + 'help')) {
        const embed = new Discord.MessageEmbed()
                    .setAuthor(client.user.username + ": Have fun!", client.user.displayAvatarURL())
                    .setColor('#FF69B4')
                    .setDescription('Prefix: `' + _con + '`' + "    Example: `"+_con + "praise`")
                    .addField(":hammer:  Moderation", "`welcome`  `levelsystem`  `prefix`  `reset`  `defaultrole`", true)
                    .addField(":repeat:  Redirection", "`welcomechannel`  `levelchannel`  `nsfw`", true)
                    .addField(":purple_heart:   Support", "`invite`  `donate`  `support`", true)
                    .addField(":frame_photo:  Images", "`gif`  `milgirls` `wp`  `render`  `uwu`", true)
                    .addField("<:blobevil:677233622708781056>  Fun", "`rank`  `insult`  `praise`  `8ball`", true)
                    .addField("<:LewdMegumin:604743431620788464>  Hentai", "`hentai`  `ecchi`  `hrender`  `hx`", true)
                    .addField("<:Hehe:705519890366333130>  Beatbox", "`pattern`  `randomsound`  `basics`", true)
                    .setFooter('Support: https://discord.gg/ZjSBhuD | Made By Kogeki#8633');
                message.channel.send(embed);
    }
    if(msg.startsWith(_con + 'donate')) {
        const embed = new Discord.MessageEmbed()
        .setAuthor(client.user.username + ": Have fun!", client.user.displayAvatarURL())
        .setColor('#FF69B4')
        .setDescription("Donate link: [donate here](https://donatebot.io/checkout/695298882619572295)")
        .setFooter('Support: https://discord.gg/ZjSBhuD | Made By Kogeki#8633');
    message.channel.send(embed);
    }
    if(msg.startsWith(_con + 'support')) {
        const embed = new Discord.MessageEmbed()
        .setAuthor(client.user.username + ": Have fun!", client.user.displayAvatarURL())
        .setColor('#FF69B4')
        .setDescription("Support discord link: https://discord.gg/ZjSBhuD")
        .setFooter('Support: https://discord.gg/ZjSBhuD | Made By Kogeki#8633');
    message.channel.send(embed);
    }
    if(msg.startsWith(_con + 'invite')) {
        const embed = new Discord.MessageEmbed()
        .setAuthor(client.user.username + ": Have fun!", client.user.displayAvatarURL())
        .setColor('#FF69B4')
        .setDescription("[Invite link](https://discordapp.com/oauth2/authorize?client_id=703612286161387531&scope=bot&permissions=8)")
        .setFooter('Support: https://discord.gg/ZjSBhuD | Made By Kogeki#8633');
    message.channel.send(embed);
    }
    if(msg.startsWith(_con + 'levelchannel')) { 
        if(message.member.hasPermission('ADMINISTRATOR')) {
            if(client.data[id].levelsystem === 'true') { 
                if(!message.guild.me.hasPermission('MANAGE_CHANNELS')) return message.channel.send('I do not have permission for that! (MANAGE_CHANNELS)');
                let neu = client.data[id].prefix;
            const args = message.content.slice(neu.length+12).trim().split(/ +/g);
            if(args != ''){
                if(message.guild.channels.cache.find(c => c.name === args[0])) {
                    client.data[id] = {
                        prefix: client.data[id].prefix,
                        logs: client.data[id].logs,
                        music: client.data[id].music,
                        welcome: client.data[id].welcome,
                        nsfw: client.data[id].nsfw,
                        editrole: client.data[id].editrole,
                        defaultrole: client.data[id].defaultrole,
                        welcomechannel: client.data[id].welcomechannel,
                        levelsystem: client.data[id].levelsystem,
                        levelchannel: args[0]
                    }
                    fs.writeFile("./servers.json", JSON.stringify (client.data, null, 4), err => {
                        if(err) throw err;
                    });
                    sendEmbed(message,message.channel.name, 'Level channel', 'Levelchannel has been set to: ' + args[0]);
                    //message.channel.send();
                } else {
                    sendEmbed(message, message.channel.name, 'Level channel', '404 Channel not found, make sure to first create the channel');
                }
            } else {
                sendEmbed(message,message.channel.name, 'Level channel', 'You need to provide a channel name');
               // message.reply('You need to provide a channel name');
            }
            
             } else {
                sendEmbed(message,message.channel.name, 'Level channel', "Levelsystem is disabled on this server");
               // message.channel.send("Welcome messages are disabled on this server");
             }

        }
     }
    if(msg.startsWith(_con + 'welcomechannel')) { 
        if(message.member.hasPermission('ADMINISTRATOR')) {
            
            if(client.data[id].welcome === 'true') {
                if(!message.guild.me.hasPermission('MANAGE_CHANNELS')) return message.channel.send('I do not have permission for that! (MANAGE_CHANNELS)');
                let neu = client.data[id].prefix;
            const args = message.content.slice(neu.length+14).trim().split(/ +/g);
            if(args != ''){
                if(message.guild.channels.cache.find(c => c.name === args[0])) {
                    client.data[id] = {
                        prefix: client.data[id].prefix,
                        logs: client.data[id].logs,
                        music: client.data[id].music,
                        welcome: client.data[id].welcome,
                        nsfw: client.data[id].nsfw,
                        editrole: client.data[id].editrole,
                        defaultrole: client.data[id].defaultrole,
                        welcomechannel: args[0],
                        levelsystem: client.data[id].levelsystem,
                        levelchannel: client.data[id].levelchannel
                    }
                    fs.writeFile("./servers.json", JSON.stringify (client.data, null, 4), err => {
                        if(err) throw err;
                    });
                    sendEmbed(message,message.channel.name, 'Welcome channel', 'Welcomechannel has been set to: ' + args[0]);
                    //message.channel.send();
                } else {
                    sendEmbed(message,message.channel.name, 'Welcome channel', '404 Channel not found, make sure to first create the channel');
                   // message.reply();
                }
            } else {
                sendEmbed(message,message.channel.name, 'Welcome channel', 'You need to provide a channel name');
               // message.reply('You need to provide a channel name');
            }
            
             } else {
                sendEmbed(message,message.channel.name, 'Welcome channel', "Welcome messages are disabled on this server");
               // message.channel.send("Welcome messages are disabled on this server");
             }

        }
     }
    if(msg.startsWith(_con + 'logs')) {
        if(message.member.hasPermission('ADMINISTRATOR')) {
            if(client.data[id].logs === 'false') {
                if(!message.guild.me.hasPermission('MANAGE_CHANNELS')) return message.channel.send('I do not have permission for that! (MANAGE_CHANNELS)');
                message.guild.channels.create('logs', { reason: 'Log channel' })
                        .then(console.log)
                        .catch(console.error);
                if(!message.guild.channels.cache.find(c => c.name === "logs")) {
                    message.guild.channels.create('logs', { reason: 'Log channel' })
                        .then(console.log)
                        .catch(console.error);
                        client.data[id] = {
                            prefix: client.data[id].prefix,
                            logs: 'true',
                            music: client.data[id].music,
                            welcome: client.data[id].welcome,
                            nsfw: client.data[id].nsfw,
                            editrole: client.data[id].editrole,
                            defaultrole: client.data[id].defaultrole,
                            welcomechannel: client.data[id].welcomechannel,
                            levelsystem: client.data[id].levelsystem,
                            levelchannel: client.data[id].levelchannel
                        }
                        fs.writeFile("./servers.json", JSON.stringify (client.data, null, 4), err => {
                            if(err) throw err;
                        });
                } else  if(message.guild.channels.cache.find(c => c.name === "logs")) { 
                    client.data[id] = {
                        prefix: client.data[id].prefix,
                        logs: 'true',
                        music: client.data[id].music,
                        welcome: client.data[id].welcome,
                        nsfw: client.data[id].nsfw,
                        editrole: client.data[id].editrole,
                        defaultrole: client.data[id].defaultrole,
                        welcomechannel: client.data[id].welcomechannel,
                        levelsystem: client.data[id].levelsystem,
                        levelchannel: client.data[id].levelchannel
                    }
                    fs.writeFile("./servers.json", JSON.stringify (client.data, null, 4), err => {
                        if(err) throw err;
                    });
                    sendEmbed(message, message.channel.name, "Settings", "Logs are now enabled.");
                }
            } else if(client.data[id].logs === 'true') {
                client.data[id] = {
                    prefix: client.data[id].prefix,
                    logs: 'false',
                    music: client.data[id].music,
                    welcome: client.data[id].welcome,
                    nsfw: client.data[id].nsfw,
                    editrole: client.data[id].editrole,
                    defaultrole: client.data[id].defaultrole,
                    welcomechannel: client.data[id].welcomechannel,
                    levelsystem: client.data[id].levelsystem,
                    levelchannel: client.data[id].levelchannel
                }
                fs.writeFile("./servers.json", JSON.stringify (client.data, null, 4), err => {
                    if(err) throw err;
                });
                sendEmbed(message, message.channel.name, "Settings", "Logs are now disabled.");
            }
        } else {
            sendEmbed(message, message.channel.name, "Settings", "You are not permitted to do that. Need ADMINISTRATOR for that.");
        }
    }
    if(msg.startsWith(_con + 'prefix')) {
        if(message.author.bot)
        if(message.member.hasPermission('ADMINISTRATOR')) {
            let neu = client.data[id].prefix;
            const args = message.content.slice(neu.length+6).trim().split(/ +/g);
            if(args != ''){
                client.data[id] = {
                    prefix: args[0],
                    logs: client.data[id].logs,
                    music: client.data[id].music,
                    welcome: client.data[id].welcome,
                    nsfw: client.data[id].nsfw,
                    editrole: client.data[id].editrole,
                    defaultrole: client.data[id].defaultrole,
                    welcomechannel: client.data[id].welcomechannel,
                    levelsystem: client.data[id].levelsystem,
                    levelchannel: client.data[id].levelchannel
                }
                fs.writeFile("./servers.json", JSON.stringify (client.data, null, 4), err => {
                    if(err) throw err;
                });
                sendEmbed(message, message.channel.name, "Settings", "Prefix of the bot has been set to: " + args[0]);
                //message.channel.send('Prefix of the bot has been set to: ' + args[0]);
            } else {
                sendEmbed(message, message.channel.name, "Settings", "You need to enter a prefix");
            }
        } else {
            sendEmbed(message, message.channel.name, "Settings", "You are not permitted to do that. Need ADMINISTRATOR for that.");
        }
    }
    if(msg.startsWith(_con + 'nsfw')) {
        if(message.member.hasPermission('ADMINISTRATOR')) {
            if(client.data[id].nsfw === 'false') {
                client.data[id] = {
                    prefix: client.data[id].prefix,
                    logs: client.data[id].logs,
                    music: client.data[id].music,
                    welcome: client.data[id].welcome,
                    nsfw: 'true',
                    editrole: client.data[id].editrole,
                    defaultrole: client.data[id].defaultrole,
                    welcomechannel: client.data[id].welcomechannel,
                    levelsystem: client.data[id].levelsystem,
                    levelchannel: client.data[id].levelchannel
                }
                fs.writeFile("./servers.json", JSON.stringify (client.data, null, 4), err => {
                    if(err) throw err;
                });
                sendEmbed(message, message.channel.name, "NSFW", "NSFW is now allowed on this server.");
            } else if(client.data[id].nsfw === 'true') {
                client.data[id] = {
                    prefix: client.data[id].prefix,
                    logs: client.data[id].logs,
                    music: client.data[id].music,
                    welcome: client.data[id].welcome,
                    nsfw: 'false',
                    editrole: client.data[id].editrole,
                    defaultrole: client.data[id].defaultrole,
                    welcomechannel: client.data[id].welcomechannel,
                    levelsystem: client.data[id].levelsystem,
                    levelchannel: client.data[id].levelchannel
                }
                fs.writeFile("./servers.json", JSON.stringify (client.data, null, 4), err => {
                    if(err) throw err;
                });
                sendEmbed(message, message.channel.name, "NSFW", "NSFW is now disabled on this server");
            }
        } else {
            sendEmbed(message, message.channel.name, "NSFW", "You are not permitted to do that. Need ADMINISTRATOR for that.");
        }
    }
    if(msg.startsWith(_con + 'editrole')) {
        
    }
    if(msg.startsWith(_con + 'reset')) {
        if(message.member.hasPermission('ADMINISTRATOR')) { 
            client.data[id] = {
                prefix: '.',
                logs: 'false',
                music: 'false',
                welcome: 'false',
                nsfw: 'false',
                editrole: 'admin',
                defaultrole: 'false',
                welcomechannel: 'welcome',
                levelsystem: 'false',
                levelchannel: 'level-up'
            }
            //write to the json
            fs.writeFile("./servers.json", JSON.stringify (client.data, null, 4), err => {
                if(err) throw err;
            });
            sendEmbed(message, message.channel.name, "Settings", "Bot settings have been reset");
        } else {
            sendEmbed(message, message.channel.name, "Settings", "You are not permitted to do that. Need ADMINISTRATOR for that.");
            //message.channel.send("You are not permitted to do that. Need ADMINISTRATOR for that.");
        }
    }
    if(msg.startsWith(_con + 'welcome')&& !msg.startsWith(_con + 'welcomechannel')) {
        if(message.member.hasPermission('ADMINISTRATOR')) {
            if(!message.guild.me.hasPermission('MANAGE_CHANNELS')) return sendEmbed(message, message.channel.name, "Missing Permissions", "I don't have the required permissions to operate(MANAGE_CHANNELS)");
            if(client.data[id].welcome === 'false') {
                sendEmbed(message, message.channel.name, "Settings", "Welcomes are now enabled.");
                message.guild.channels.create('welcome', { reason: 'welcome channel' })
                        .then(console.log)
                        .catch(console.error);
                if(!message.guild.channels.cache.find(c => c.name === "welcome")) {
                    message.guild.channels.create('welcome', { reason: 'welcome channel' })
                        .then(console.log)
                        .catch(console.error);
                        client.data[id] = {
                            prefix: client.data[id].prefix,
                            logs: client.data[id].logs,
                            music: client.data[id].music,
                            welcome: 'true',
                            nsfw: client.data[id].nsfw,
                            editrole: client.data[id].editrole,
                            defaultrole: client.data[id].defaultrole,
                            welcomechannel: client.data[id].welcomechannel,
                            levelsystem: client.data[id].levelsystem,
                            levelchannel: client.data[id].levelchannel
                        }
                        fs.writeFile("./servers.json", JSON.stringify (client.data, null, 4), err => {
                            if(err) throw err;
                        });
                } else  if(message.guild.channels.cache.find(c => c.name === "welcome")) { 
                    client.data[id] = {
                        prefix: client.data[id].prefix,
                        logs: client.data[id].logs,
                        music: client.data[id].music,
                        welcome: 'true',
                        nsfw: client.data[id].nsfw,
                        editrole: client.data[id].editrole,
                        defaultrole: client.data[id].defaultrole,
                        welcomechannel: client.data[id].welcomechannel,
                        levelsystem: client.data[id].levelsystem,
                        levelchannel: client.data[id].levelchannel
                    }
                    fs.writeFile("./servers.json", JSON.stringify (client.data, null, 4), err => {
                        if(err) throw err;
                    });
                    
                }
            } else if(client.data[id].welcome === 'true') {
                client.data[id] = {
                    prefix: client.data[id].prefix,
                    logs: client.data[id].logs,
                    music: client.data[id].music,
                    welcome: 'false',
                    nsfw: client.data[id].nsfw,
                    editrole: client.data[id].editrole,
                    defaultrole: client.data[id].defaultrole,
                    welcomechannel: client.data[id].welcomechannel,
                    levelsystem: client.data[id].levelsystem,
                    levelchannel: client.data[id].levelchannel
                }
                fs.writeFile("./servers.json", JSON.stringify (client.data, null, 4), err => {
                    if(err) throw err;
                });
                if(message.guild.channels.cache.find(c => c.name === client.data[id].welcomechannel)) {
                    message.guild.channels.cache.find(c => c.name === client.data[id].welcomechannel).delete();
                }
                sendEmbed(message, message.channel.name, "Settings", "Welcomes are now disabled");
            }
        } else {
            sendEmbed(message, message.channel.name, "Settings", "You are not permitted to do that. Need ADMINISTRATOR for that.");
        }
    }
    if(msg.startsWith(_con + 'defaultrole')) {
        if(message.member.hasPermission('ADMINISTRATOR')) {  
            if(!message.guild.me.hasPermission('MANAGE_ROLES')) return sendEmbed(message, message.channel.name, "Missing Permissions", "I don't have the required permissions to operate(MANAGE_ROLES)");
            const args = message.content.slice(_con.length+11).trim().split(/ +/g);
            if(client.data[id].defaultrole === 'false') {
            if(args[0] != 'clear') {
            if(args != ''){
                client.data[id] = {
                    prefix: client.data[id].prefix,
                    logs: client.data[id].logs,
                    music: client.data[id].music,
                    welcome: client.data[id].welcome,
                    nsfw: client.data[id].nsfw,
                    editrole: client.data[id].editrole,
                    defaultrole: args[0],
                    welcomechannel: client.data[id].welcomechannel,
                    levelsystem: client.data[id].levelsystem,
                    levelchannel: client.data[id].levelchannel
                }
                fs.writeFile("./servers.json", JSON.stringify (client.data, null, 4), err => {
                    if(err) throw err;
                });
                message.guild.roles.create({
                    data: {
                      name: args[0],
                      color: 'WHITE',
                    },
                    reason: 'we needed a role for Super Cool People',
                  })
                    .then(console.log)
                    .catch(console.error);
                    sendEmbed(message, message.channel.name, "Settings", 'Defaultrole of the server has been set to: ' + args[0]);
                //message.channel.send('Defaultrole of the server has been set to: ' + args[0]);
                } else {
                    sendEmbed(message, message.channel.name, "Settings", 'You need to provide a rolename or **clear**');
                    //message.channel.send('You need to provide a rolename or **clear**');
                }
            } else if(args[0] === 'clear') {
                if(message.guild.roles.cache.find(r => r.name === client.data[id].defaultrole)) {
                    message.guild.roles.cache.find(r => r.name === client.data[id].defaultrole).delete();
                }
                client.data[id] = {
                    prefix: client.data[id].prefix,
                    logs: client.data[id].logs,
                    music: client.data[id].music,
                    welcome: client.data[id].welcome,
                    nsfw: client.data[id].nsfw,
                    editrole: client.data[id].editrole,
                    defaultrole: 'false',
                    welcomechannel: client.data[id].welcomechannel,
                    levelsystem: client.data[id].levelsystem,
                    levelchannel: client.data[id].levelchannel
                }
                fs.writeFile("./servers.json", JSON.stringify (client.data, null, 4), err => {
                    if(err) throw err;
                });
                sendEmbed(message, message.channel.name, "Settings", 'Default role has been cleared');
            }
        }
        } else {
            sendEmbed(message, message.channel.name, "Settings", "You are not permitted to do that. Need ADMINISTRATOR for that.");
           // message.channel.send("You are not permitted to do that. Need ADMINISTRATOR for that.");
        }
    }
    if(msg.startsWith(_con + 'levelsystem')) {
        if(message.member.hasPermission('ADMINISTRATOR')) {  
            if(!message.guild.me.hasPermission('MANAGE_CHANNELS') && !message.guild.me.hasPermission('MANAGE_ROLES')) return sendEmbed(message, message.channel.name, "Missing Permissions", "I don't have the required permissions to operate(MANAGE_CHANNELS & MANAGE_ROLES)");
            const args = message.content.slice(_con.length+11).trim().split(/ +/g);
            if(client.data[id].levelsystem === 'false') {
                client.data[id] = {
                    prefix: client.data[id].prefix,
                    logs: client.data[id].logs,
                    music: client.data[id].music,
                    welcome: client.data[id].welcome,
                    nsfw: client.data[id].nsfw,
                    editrole: client.data[id].editrole,
                    defaultrole: client.data[id].defaultrole,
                    welcomechannel: client.data[id].welcomechannel,
                    levelsystem: 'true',
                    levelchannel: 'level-up'
                }
                fs.writeFile("./servers.json", JSON.stringify (client.data, null, 4), err => {
                    if(err) throw err;
                });
                if(!client.xp[id]) {
                    client.xp[id] = {

                    }
                }
                    fs.writeFile("./xp.json", JSON.stringify (client.xp, null, 4), err => {
                        if(err) throw err;
                    });
                message.guild.channels.create('level-up', { reason: 'Log channel' })
                        .then(console.log)
                        .catch(console.error);
                roleC(message, "Level 5", "Level 5 Role", '#ffffff');
                roleC(message, "Level 10", "Level 10 Role", '#4da6ff');
                roleC(message, "Level 20", "Level 20 Role", '#00ffff');
                roleC(message, "Level 30", "Level 30 Role", '#ff0000');
                roleC(message, "Level 40", "Level 40 Role", '#ff4297');
                roleC(message, "Level 50", "Level 50 Role", '#ff00b7');
                    sendEmbed(message, message.channel.name, "Settings", 'Levelsystem has been enabled, roles and level-up channel have been created.');
                //message.channel.send('Defaultrole of the server has been set to: ' + args[0]);
        } else if(client.data[id].levelsystem === 'true') {
            if(message.guild.channels.cache.find(c => c.name === client.data[id].levelchannel)) {
                message.guild.channels.cache.find(c => c.name === client.data[id].levelchannel).delete();
            }
            client.data[id] = {
                prefix: client.data[id].prefix,
                logs: client.data[id].logs,
                music: client.data[id].music,
                welcome: client.data[id].welcome,
                nsfw: client.data[id].nsfw,
                editrole: client.data[id].editrole,
                defaultrole: client.data[id].defaultrole,
                welcomechannel: client.data[id].welcomechannel,
                levelsystem: 'false',
                levelchannel: 'level-up'
            }
            if(message.guild.roles.cache.find(role => role.name === 'Level 5')) {
                if(!message.guild.me.hasPermission('MANAGE_ROLES')) return sendEmbed(message, message.channel.name, "Missing Permissions", "I don't have the required permissions to operate(MANAGE_ROLES)");
                message.guild.roles.cache.find(role => role.name === 'Level 5').delete();
            }
            if(message.guild.roles.cache.find(role => role.name === 'Level 10')) {
                if(!message.guild.me.hasPermission('MANAGE_ROLES')) return sendEmbed(message, message.channel.name, "Missing Permissions", "I don't have the required permissions to operate(MANAGE_ROLES)");
                message. guild.roles.cache.find(role => role.name === 'Level 10').delete();
            }
            if(message.guild.roles.cache.find(role => role.name === 'Level 20')) {
                if(!message.guild.me.hasPermission('MANAGE_ROLES')) return sendEmbed(message, message.channel.name, "Missing Permissions", "I don't have the required permissions to operate(MANAGE_ROLES)");
                message.guild.roles.cache.find(role => role.name === 'Level 20').delete();
            }
            if(message.guild.roles.cache.find(role => role.name === 'Level 30')) {
                if(!message.guild.me.hasPermission('MANAGE_ROLES')) return sendEmbed(message, message.channel.name, "Missing Permissions", "I don't have the required permissions to operate(MANAGE_ROLES)");
                message. guild.roles.cache.find(role => role.name === 'Level 30').delete();
            }
            if(message.guild.roles.cache.find(role => role.name === 'Level 40')) {
                if(!message.guild.me.hasPermission('MANAGE_ROLES')) return sendEmbed(message, message.channel.name, "Missing Permissions", "I don't have the required permissions to operate(MANAGE_ROLES)");
                message.guild.roles.cache.find(role => role.name === 'Level 40').delete();
            }
            if(message.guild.roles.cache.find(role => role.name === 'Level 50')) {
                if(!message.guild.me.hasPermission('MANAGE_ROLES')) return sendEmbed(message, message.channel.name, "Missing Permissions", "I don't have the required permissions to operate(MANAGE_ROLES)");
                message.guild.roles.cache.find(role => role.name === 'Level 50').delete();
            }
            
            fs.writeFile("./servers.json", JSON.stringify (client.data, null, 4), err => {
                if(err) throw err;
            });
            sendEmbed(message, message.channel.name, "Settings", 'Levelsystem has been disabled.');
        }
        } else {
            sendEmbed(message, message.channel.name, "Settings", "You are not permitted to do that. Need ADMINISTRATOR for that.");
           // message.channel.send("You are not permitted to do that. Need ADMINISTRATOR for that.");
        }
    }
    //fun commands
    if (msg.startsWith(_con + 'uwu')) { 
        one = './images/1.png';two = './images/2.png';three = './images/3.png';four = './images/4.png';
        five = './images/5.png';six = './images/6.png';seven = './images/7.png';eight = './images/8.png';
        nine = './images/9.png';ten = './images/10.png';eleven = './images/11.png';twelve = './images/12.png';
        thirteen = './images/13.png';fourteen = './images/14.png';fifteen = './images/15.png';sixteen = './images/16.png';
        seventeen = './images/17.png';eighteen = './images/18.png';nineteen = './images/19.png';twenty = './images/20.png';
        number = 39;
        var random = Math.floor (Math.random() * (number-1+1)) + 1;
        message.channel.send({files: ["./images/" + random  + ".png"]});
        message.react(':pUwu:677233543734231040');
      }
      if (msg.startsWith(_con + 'rank')) { 
        if(client.data[id].levelsystem === "true") {
            if(client.xp[id][message.author.id]) {
                if(message.channel.name === client.data[id].levelchannel) {
                    sendEmbed(message, client.data[id].levelchannel, "Rank", message.author.username + " is level " + client.xp[id][message.author.id].level)
                   
                }
            }
        } else {
            
        }
      }
      if (msg.startsWith(_con + 'render')) { 
        number = 77;
        var random = Math.floor (Math.random() * (number-1+1)) + 1;
        message.channel.send({files: ["./renders/" + 'Render Anime' +random  + ".png"]});
      }
      if (msg.startsWith(_con + 'wp')||msg.startsWith(_con + 'wallpaper')) { 
        number = 83;
        var random = Math.floor (Math.random() * (number-1+1)) + 1;
        message.channel.send({files: ["./anime/" +random  + ".jpg"]});
      }
      if (msg.startsWith(_con + 'hentai')||msg.startsWith(_con + 'ht')) { 
        if(message.channel.nsfw){
          if(client.data[id].nsfw === 'true') {
            number = 729;
            var random = Math.floor (Math.random() * (number-1+1)) + 1;
            message.channel.send({files: ["./hentais/" +random  + ".jpg"]});
          } else {
            message.channel.send('NSFW is disabled on this server!');
          }
        } else {
          message.channel.send('Please consider using a NSFW marked Channel for that');
        }
      }
    
      if (msg.startsWith(_con + 'extra')||msg.startsWith(_con + 'hx')) { 
        if(message.channel.nsfw){
          if(client.data[id].nsfw === 'true') { 
            number = 51;
            var random = Math.floor (Math.random() * (number-1+1)) + 1;
            message.channel.send({files: ["./extras/" +random  + ".jpg"]});
          }else {
            message.channel.send('NSFW is disabled on this server!');
          }
          
        } else {
          message.channel.send('Please consider using a NSFW marked Channel for that');
        }
      }
    
      if (msg.startsWith(_con + 'hrender')||msg.startsWith(_con + 'hr')) { 
        if(message.channel.nsfw){
          if(client.data[id].nsfw === 'true') { 
            number = 450;
            var random = Math.floor (Math.random() * (number-1+1)) + 1;
            message.channel.send({files: ["./hrender/" +random  + ".png"]});
          }else {
            message.channel.send('NSFW is disabled on this server!');
          }
    
        } else {
          message.channel.send('Please consider using a NSFW marked Channel for that');
        }
      }
      if (msg.startsWith(_con + 'milanime')||msg.startsWith(_con + 'mg')) { 
        
          number = 138;
          var random = Math.floor (Math.random() * (number-1+1)) + 1;
          message.channel.send({files: ["./milgirls/" +random  + ".jpg"]});
        
      }
    
      if (msg.startsWith(_con + 'ecchi')) { 
        if(message.channel.nsfw){
          if(client.data[id].nsfw === 'true') { 
            number = 300;
            var random = Math.floor (Math.random() * (number-1+1)) + 1;
            message.channel.send({files: ["./ecchi/" +random  + ".png"]});
           }else {
            message.channel.send('NSFW is disabled on this server!');
          }
        } else {
          message.channel.send('Please consider using a NSFW marked Channel for that');
        }
      }
      if(message.content.startsWith(_con+`insult`)) {
        var req = unirest("GET", "https://insult.mattbas.org/api/insult");
        
        //no mention no api call
        let member = message.mentions.members.first();
        if (member == '' || member == null) {
            return message.reply('uuh, whos supposed to be insulted?');
        }
        
        req.end((res) => {
            if (res.error) {
                errorMessage();
                throw new Error(res.error);
            } 
            try {
                var insult = res.raw_body.toLowerCase();
                message.channel.send(member.user.username.toString() + ', ' + insult + '.')
                .then(e => {
                    stats.insult.update()
                })
                .catch((err) => {
                    
                }) 
            }
            catch(err){
                
                errorMessage()
            }
        });
    }
    if(message.content.startsWith(_con+`praise`)) {
        var req = unirest("GET", "https://complimentr.com/api");
        let member = message.mentions.members.first();
        //no mention no api call
        if (member == '' || member == null) {
            return message.reply('You need to tell me who it is to be praised! :)');
        }
        req.end((res) => {
            var praise = String(res.body.compliment);
            try {
                message.channel.send(member.user.username.toString() + ', ' + praise + '.')
                .then(e => {
                    stats.praise.update()
                })
                .catch((err) => {
                }) 
            }
            catch(err){
                errorMessage()
            }
        });
    }
    if(message.content.startsWith(_con+`gif`)) {
        //Removing emojis that crashed app
         noWeirdEmojis = message.content.replace(/[^\w\s]|_/g, "")
    
         let splitMessage = noWeirdEmojis.split(' ');
    
         //emoji has search term behind the 1st word
         if (splitMessage.length >= 2) {
             splitMessage.shift();
             splitMessage = splitMessage.join("+");
    
             var req = unirest("GET", "https://api.giphy.com/v1/gifs/search?&api_key=" + gifToken + "&q=" + splitMessage + '&limit=35');
             
             req.end((res) => {
                 var totalResponses = res.body.data.length;
                 var resIndex = Math.floor(Math.random() * (totalResponses));
                 var selectedGif = res.body.data[resIndex];
                 
                 if(res.error){
                     errorMessage()
                     throw new Error(res.error);
                 }
    
                 if (!totalResponses) {
                     return message.channel.send('No search results...');
                 } 
    
                 try {
                     message.channel.send({files: [selectedGif.images.fixed_height.url]})
                     .then(() => {
                         stats.gif.update()
                     })
                     .catch((err) => {
                         
                     })
                 }
                 catch(err) {
                     errorMessage();
                     
                 } 
             });
    
         // no search term and results in random gif
         } else {
             var req = unirest("GET", "http://api.giphy.com/v1/gifs/random?api_key=" + gifToken);
             
             req.end((res) => {
                 if(res.error){
                     errorMessage()
                     throw new Error(res.error);
                 }
    
                 var gif = res.body.data.images.fixed_height.url;
                 try {
                     message.channel.send({files: [gif]})
                     .then(() => {
                         stats.gif.update()
                     })
                     .catch((err) => {
                         
                     })
                 }
                 catch(err) {
                     
                     errorMessage();
                 } 
             })
         }
     }
    if(msg.startsWith(_con+'randomsound')) {
        const activities_list = [
            "Inward K Snare", 
            "Throat Bass",
            "Fart Bass", 
            "Inward Bass",
            "Inward Liproll",
            "zipper",
            "Click Roll",
            "Liproll",
            "hi-hat",
            "throat kick",
            "Kick drum",
            "Spit snare",
            "Cough Snare",
            "lip bass",
            "rimshot",
            "pf snare",
            "psh snare",
            "hollow clop",
            "reverse liproll",
            "dry kick",
            "water drop",
            "tkK",
            "Vibration Bass",
            "Polyphonic voice/double voice",
            "ESH snare",
            "Human Trumpet",
            "Human Saxophone",
            "Acid Bass 303",
            "Synth",
            "Chest Bass",
            "Siren",
            "Sucker Punch",
            "Hollow Clop Snare"
            ]
        const index = Math.floor(Math.random() * (activities_list.length - 1) + 1);
        message.reply(activities_list[index]);
    }
    if(msg.startsWith(_con+'pattern')) { 
        const activities_list = [
            "`B	t	K	t	t	b	K	t	t	b	K	t	t	b	K	t`",
            "`B		T		K	k	t	b	B	b	t	b	K	k	t	b`",
            "`B	t	t	b	t	b	K	t	t	t	t	b	t	b	K	t`",
            "`B	t	t		K	t	t		T	t	t	b	K	b	t	k`",
            "`B		t		K	t		t		t		t	K	t		t`",
            "`B	t	t	K	t	t	b	t	K	t	t	K	t	t	b	t`",
            "`B	k	t	t	B	k	t	t	B	k	t	b	K	b	t	t`",
            "`B	t	t	t	t	t	K	t	t	t	t	t	B	t	K	t`",
            "`B	t	t	b	B	t	t	b	B	t	t	k	t	b	b	b`",
            "`B	t	K	t	t	b	K	t	K	t	t	b	K	t	K	t`"
        ]
        const index = Math.floor(Math.random() * (activities_list.length - 1) + 1);
        message.channel.send(activities_list[index]);
    }
    if(msg.startsWith(_con+'basic')) {
        message.channel.send('Kick Drum - B/b (hardened)');
        message.channel.send('Hi-Hat - T/t (hardened)');
        message.channel.send('Snare Drum - K (outward)');
        message.channel.send('B t K t t B K t');
    }
    if (message.content.startsWith(_con+`8ball`)) {
        let query = message.content.split(' ')
    
        if (query.length >= 2) {
    
            query.shift()
            let answer = query.join(' ')
            var req = unirest('get',"https://8ball.delegator.com/magic/JSON/" + answer)
    
            req.end((res) => {
                try {
                    message.channel.send('```' + "?: " + res.body.magic.question + '\n' + "!: " + res.body.magic.answer + '```')
                    .then(() => {
                        stats.answer.update()
                    })
                    .catch((err) => {
                    })
                }
                catch(err) {
                    errorMessage();
                } 
            })
        } else {
            message.channel.send("You need to ask me a question.");
        }
    }
});
//write to file on join and send message to the first available channel
client.on("guildCreate", guild => {
    const embed = new Discord.MessageEmbed()
                    .setTitle('Thanks for inviting me!')
                    .setColor('#ffffff')
                    .setDescription('Type '+prefix+'help for help!')
                    .setFooter('Support: https://discord.gg/ZjSBhuD');
    //set a const to default channel
    const channel = getDefaultChannel(guild);
    channel.send(embed);
    var id = guild.id;
    client.data[id];
    if(!client.data[id]) {
        client.data[id] = {
            prefix: '.',
            logs: 'false',
            music: 'false',
            welcome: 'false',
            nsfw: 'false',
            editrole: 'admin',
            defaultrole: 'false',
            welcomechannel: 'welcome',
            levelsystem: 'false',
            levelchannel: 'level-up'
        }
        fs.writeFile("./servers.json", JSON.stringify (client.data, null, 4), err => {
            if(err) throw err;
        });
    }
});
client.on('guildMemberAdd', member => {
    var id = member.guild.id;
    if(client.data[id].welcome ==='true') {
        if(member.guild.channels.cache.find(c => c.name === 'welcome')) {
            if(!member.guild.me.hasPermission('MANAGE_ROLES')) getDefaultChannel(member.guild).send(sendEmbed(member, getDefaultChannel(member.guild), "Missing Permissions", "I don't have the required permissions to operate(MANAGE_ROLES)"));
            const channelz = member.guild.channels.cache.find(c => c.name === 'welcome');
            const embed = new Discord.MessageEmbed()
                .setThumbnail(member.user.displayAvatarURL())
                .setAuthor(member.displayAvatarURL(),"A new user checked in.")
                .setColor('#ff2ec7')
                .setDescription(member.user.username)
                .addField('Account creation:',member.user.createdAt,true)
                .setFooter('Tag: ' + member.user.tag);
            channelz.send(embed);
        } else {
            sendEmbed(member, getDefaultChannel(member.guild), "Welcome channel", "**WARNING**: The welcome channel is missing! Please use *prefix* or *reset* to manage it!");
        }
    }
    if(client.data[id].logs === true) {
        if(member.guild.channels.cache.find(c => c.name === 'logs')) { 
            if(!member.guild.me.hasPermission('MANAGE_ROLES')) getDefaultChannel(member.guild).send(sendEmbed(member, getDefaultChannel(member.guild), "Missing Permissions", "I don't have the required permissions to operate(MANAGE_ROLES)"));
            const channelz = member.guild.channels.cache.find(c => c.name === 'logs');
            const embed = new Discord.MessageEmbed()
                .setThumbnail(member.user.displayAvatarURL())
                .setTitle("A user joined the server")
                .setColor('#ff2ec7')
                .setDescription(member.user.username)
                .addField('Account creation:',member.user.createdAt,true)
                .setFooter('Tag: ' + member.user.tag);
            channelz.send(embed);
        }
    }
    if(client.data[id].defaultrole != 'false') {
        if(member.guild.roles.cache.find(r => r.name === client.data[id].defaultrole)) {
            if(!member.guild.me.hasPermission('MANAGE_ROLES')) getDefaultChannel(member.guild).send(sendEmbed(member, getDefaultChannel(member.guild), "Missing Permissions", "I don't have the required permissions to operate(MANAGE_ROLES)"));
            member.roles.add(member.guild.roles.cache.find(r => r.name === client.data[id].defaultrole));
        } else {
            sendEmbed(member, getDefaultChannel(member.guild), "Default role", "**WARNING**: The default role is missing! Please use *prefix* or *reset* to manage it!");
        }
    }
});
client.on('guildMemberRemove', member => {
    var id = member.guild.id;
    if(client.data[id].logs === true) {
        if(member.guild.channels.cache.find(c => c.name === 'logs')) { 
            const channelz = member.guild.channels.cache.find(c => c.name === 'logs');
            const embed = new Discord.MessageEmbed()
                .setThumbnail(member.user.displayAvatarURL())
                .setTitle("A user left the server")
                .setColor('#ff2ec7')
                .setDescription(member.user.username)
                .addField('Joined At:',member.joinedAt,true)
                .setFooter('Tag: ' + member.user.tag);
            channelz.send(embed);
        } else {
            message.guild.channels.create('logs', { reason: 'Log channel' })
                        .then(console.log)
                        .catch(console.error);
        }
    }
});
client.on('guildMemberAdd', member => {
    if(member.guild.id === '705174264894062712') {
        member.roles.add(member.guild.roles.cache.find(r => r.name === "NORMIE"));
    }
});

function sendEmbed(message, channelt, name, messages) {
    const channelz = message.guild.channels.cache.find(c => c.name === channelt);
            const embed = new Discord.MessageEmbed()
                .setTitle(name)
                .setColor('#FF69B4')
                .setDescription(messages);
            channelz.send(embed);
}

client.data = require('./servers.json');
client.login(token);