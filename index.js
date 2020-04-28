const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
var Long = require("long");
const unirest = require("unirest");
const {
    prefix, token, gifToken
}=require('./config.json');
client.data = require('./servers.json');
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
    "on " + client.guilds.cache.size + ' servers',
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
client.on("message", message => {
    if(message.author.id === '232186922812833792') {
        if(message.content.startsWith('-S')) {
            message.delete()
            .then(client.destroy());
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
            defaultrole: 'false'
        }
        //write to the json
        fs.writeFile("./servers.json", JSON.stringify (client.data, null, 4), err => {
            if(err) throw err;
        });
        
        return;
    }
    let _con = client.data[id].prefix;
    //help command
    if(msg.startsWith(_con + 'help')) {
        const embed = new Discord.MessageEmbed()
                    .setTitle('Fun, NSFW, Beatbox & Moderation')
                    .setColor('#f23f23')
                    .setDescription('Prefix: ' + _con)
                    .addField("Moderation", "`logs` `welcome` `prefix` `nsfw` `reset` `defaultrole`", true)
                    .addField("Fun", "`insult` `praise` `gif` `8ball` `milgirls` `wp` `render` `uwu`", true)
                    .addField("NSFW", "`hentai` `ecchi` `hrender` `hx`", true)
                    .addField("Beatbox", "`pattern` `randomsound` `basics` `beatboxer`", true)
                    .setFooter('Support: https://discord.gg/ZjSBhuD');
                message.channel.send(embed);
    }
    if(msg.startsWith(_con + 'logs')) {
        if(message.member.guild.me.hasPermission('ADMINISTRATOR')) {
            if(client.data[id].logs === 'false') {
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
                            defaultrole: client.data[id].defaultrole
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
                        defaultrole: client.data[id].defaultrole
                    }
                    fs.writeFile("./servers.json", JSON.stringify (client.data, null, 4), err => {
                        if(err) throw err;
                    });
                    message.channel.send('Logs are now enabled');
                }
            } else if(client.data[id].logs === 'true') {
                client.data[id] = {
                    prefix: client.data[id].prefix,
                    logs: 'false',
                    music: client.data[id].music,
                    welcome: client.data[id].welcome,
                    nsfw: client.data[id].nsfw,
                    editrole: client.data[id].editrole,
                    defaultrole: client.data[id].defaultrole
                }
                fs.writeFile("./servers.json", JSON.stringify (client.data, null, 4), err => {
                    if(err) throw err;
                });
                message.channel.send('Logs are now disabled');
            }
        }
    }
    if(msg.startsWith(_con + 'prefix')) {
        if(message.author.bot) return;
        if(message.member.guild.me.hasPermission('ADMINISTRATOR')) {
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
                    defaultrole: client.data[id].defaultrole
                }
                fs.writeFile("./servers.json", JSON.stringify (client.data, null, 4), err => {
                    if(err) throw err;
                });
                message.channel.send('Prefix of the bot has been set to: ' + args[0]);
            } else {
                message.channel.send(`You need to enter a prefix.`);
            }
        }
    }
    if(msg.startsWith(_con + 'nsfw')) {
        if(message.member.guild.me.hasPermission('ADMINISTRATOR')) {
            if(client.data[id].nsfw === 'false') {
                client.data[id] = {
                    prefix: client.data[id].prefix,
                    logs: client.data[id].logs,
                    music: client.data[id].music,
                    welcome: client.data[id].welcome,
                    nsfw: 'true',
                    editrole: client.data[id].editrole,
                    defaultrole: client.data[id].defaultrole
                }
                fs.writeFile("./servers.json", JSON.stringify (client.data, null, 4), err => {
                    if(err) throw err;
                });
                message.channel.send('NSFW Content is now allowed on this server!');
            } else if(client.data[id].nsfw === 'true') {
                client.data[id] = {
                    prefix: client.data[id].prefix,
                    logs: client.data[id].logs,
                    music: client.data[id].music,
                    welcome: client.data[id].welcome,
                    nsfw: 'false',
                    editrole: client.data[id].editrole,
                    defaultrole: client.data[id].defaultrole
                }
                fs.writeFile("./servers.json", JSON.stringify (client.data, null, 4), err => {
                    if(err) throw err;
                });
                message.channel.send('NSFW Content is no more allowed on this server!');
            }
        }
    }
    if(msg.startsWith(_con + 'editrole')) {
        
    }
    if(msg.startsWith(_con + 'reset')) {
        if(message.member.guild.me.hasPermission('ADMINISTRATOR')) { 
            client.data[id] = {
                prefix: '.',
                logs: 'false',
                music: 'false',
                welcome: 'false',
                nsfw: 'false',
                editrole: 'admin',
                defaultrole: 'false'
            }
            //write to the json
            fs.writeFile("./servers.json", JSON.stringify (client.data, null, 4), err => {
                if(err) throw err;
            });
            message.reply('Bot settings have been reset')
        }
    }
    if(msg.startsWith(_con + 'welcome')) {
        if(message.member.guild.me.hasPermission('ADMINISTRATOR')) {
            if(client.data[id].welcome === 'false') {
                message.channel.send('Welcomes are now enabled');
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
                            defaultrole: client.data[id].defaultrole
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
                        defaultrole: client.data[id].defaultrole
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
                    defaultrole: client.data[id].defaultrole
                }
                fs.writeFile("./servers.json", JSON.stringify (client.data, null, 4), err => {
                    if(err) throw err;
                });
                message.channel.send('Welcomes are now disabled');
            }
        }
    }
    if(msg.startsWith(_con + 'defaultrole')) {
        if(message.member.guild.me.hasPermission('ADMINISTRATOR')) {  
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
                    defaultrole: args[0]
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
                message.channel.send('Defaultrole of the server has been set to: ' + args[0]);
                } else {
                    message.channel.send('You need to provide a rolename or **clear**')
                }
            } else if(args[0] === 'clear') {
                client.data[id] = {
                    prefix: client.data[id].prefix,
                    logs: client.data[id].logs,
                    music: client.data[id].music,
                    welcome: client.data[id].welcome,
                    nsfw: client.data[id].nsfw,
                    editrole: client.data[id].editrole,
                    defaultrole: 'false'
                }
                fs.writeFile("./servers.json", JSON.stringify (client.data, null, 4), err => {
                    if(err) throw err;
                });
                message.channel.send('Defaultrole of the server has been cleared');
            }
        }
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
            editrole: 'admin'
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
            const channelz = member.guild.channels.cache.find(c => c.name === 'welcome');
            const embed = new Discord.MessageEmbed()
                .setThumbnail(member.user.displayAvatarURL())
                .setTitle("A new user checked in.")
                .setColor('#ff2ec7')
                .setDescription(member.user.username)
                .addField('Account creation:',member.user.createdAt,true)
                .setFooter('Tag: ' + member.user.tag);
            channelz.send(embed);
        } else {
            message.guild.channels.create('welcome', { reason: 'welcome channel' })
                        .then(console.log)
                        .catch(console.error);
                        const channelz = member.guild.channels.cache.find(c => c.name === 'welcome');
                        const embed = new Discord.MessageEmbed()
                            .setThumbnail(member.user.displayAvatarURL())
                            .setTitle("A new user checked in.")
                            .setColor('#ff2ec7')
                            .setDescription(member.user.username)
                            .addField('Account creation:',member.user.createdAt,true)
                            .setFooter('Tag: ' + member.user.tag);
                        channelz.send(embed);
        }
    }
    if(client.data[id].logs === true) {
        if(member.guild.channels.cache.find(c => c.name === 'logs')) { 
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
            member.guild.roles.add(member.guild.roles.cache.find(r => r.name === client.data[id].defaultrole));
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
client.data = require('./servers.json');
client.login(token);