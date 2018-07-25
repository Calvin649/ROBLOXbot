const Discord = require('discord.js');
const robloxBOT = new Discord.Client();
const prefix = ">"
const staffPrefix = "!!"
var fs = require('fs')
const snekfetch = require('snekfetch');
const sql = require("sqlite");
sql.open("./verificationDatabase.sqlite");
var rbx = require('roblox-js');
var jar = rbx.options.jar;
var options = {
  username: 'robloxUsername',
  password: 'robloxPassword'
}
rbx.login(options)
const DBL = require("dblapi.js");
const dbl = new DBL("token");
const verificationCode = ['apple','food','yum','pizza','raindrop','snow','birthday','cake','burger','soda','ice','no','yes','orange','pear','plum'];
var Trello = require("trello");
var trello = new Trello("key", "token");
var cleverbot = require("cleverbot.io"),
cleverBotbot = new cleverbot('key','token');
cleverBotbot.setNick("robloxBot | Discord");

robloxBOT.on('ready', () => {
  console.log('Turned on the Discord client.');
  console.log('Running on guilds now...')
  robloxBOT.shard.broadcastEval('this.guilds.size').then(results => {
  robloxBOT.user.setActivity(`>info`, { type: 'WATCHING' })
  setInterval(() => {
      dbl.postStats(results.reduce((prev, val) => prev + val, 0))
    }, 100000);
  });
 })

robloxBOT.on('message', async message => {
  console.log(`${message.guild.name} - ${message.guild.memberCount} users || Channel ID - ${message.channel.id}`)

  // CONSTANTS [START]
  const args = message.content.split(/[ ]+/) // TO SPLIT FROM THE STARTER ARGUMENT
  const requestLogs = robloxBOT.channels.get('432225087299780630') // requests channel
  const botCommander = message.guild.roles.find("name", "Bot Commander");
  const robloxBOTPARTNERS = ['155882812241608704']
  const kickMember = message.guild.member(message.mentions.users.first());
  const banMember = message.guild.member(message.mentions.users.first());
  const warnMember = message.guild.member(message.mentions.users.first());
  const newBotCommander = message.guild.member(message.mentions.users.first());
  const robloxBOTLOGS = robloxBOT.channels.get('432225087299780630')
  // CONSTANTS [END]

  // SQLITE TABLES [START]
  sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`).then(row => { // ROBLOX-DISCORD VERIFICATION
      if (!row) {
        //sql.run("INSERT INTO scores (userId, robloxUsername) VALUES (?, ?)", [message.author.id, "-"]);
      } else {
        //console.log('nope!2')
        //sql.run(`UPDATE scores SET points = ${row.points + 1} WHERE userId = ${message.author.id}`);
      }
    }).catch(() => {
      console.error;
      sql.run("CREATE TABLE IF NOT EXISTS scores (userId TEXT, robloxUsername TEXT)").then(() => {
        sql.run("INSERT INTO scores (userId, robloxUsername) VALUES (?, ?)", [message.author.id, "-"]);
      });
    });

  sql.get(`SELECT * FROM groupBind WHERE guildID = "${message.guild.id}"`).then(row => { // GROUP BIND PROCESS
      if (!row) {
        sql.run("INSERT INTO groupBind (guildID, groupID) VALUES (?, ?)", [message.guild.id, 0]);
      } else {
        // nothing
      }
    }).catch(() => {
      console.error;
      sql.run("CREATE TABLE IF NOT EXISTS groupBind (guildID TEXT, groupID INTEGER)").then(() => {
        sql.run("INSERT INTO groupBind (guildID, groupID) VALUES (?, ?)", [message.guild.id, 0]);
      });
    });

  sql.get(`SELECT * FROM blackList WHERE userId ="${message.author.id}"`).then(row => { // BLACKLIST STATUS
      if (!row) {
        sql.run("INSERT INTO blackList (userId, blacklistStatus) VALUES (?, ?)", [message.author.id, 0]);
      } else {
        //
      }
      }).catch(() => {
      console.error;
      sql.run("CREATE TABLE IF NOT EXISTS blackList (userId TEXT, blacklistStatus INTEGER)").then(() => {
        sql.run("INSERT INTO blackList (userId, blacklistStatus) VALUES (?, ?)", [message.author.id, 0]);
        });
  });

  sql.get(`SELECT * FROM staffTable WHERE userId ="${message.author.id}"`).then(row => { // STAFF STATUS
      if (!row) {
        //
      } else {
        //
      }
      }).catch(() => {
      console.error;
      sql.run("CREATE TABLE IF NOT EXISTS staffTable (userId TEXT, staffStatus INTEGER)").then(() => {
        sql.run("INSERT INTO staffTable (userId, staffStatus) VALUES (?, ?)", [message.author.id, 0]);
        });
  });

  sql.get(`SELECT * FROM prefixStatus WHERE guildID = "${message.guild.id}"`).then(row => { // PREFIX STATUS
      if (!row) {
        sql.run("INSERT INTO prefixStatus (guildID, prefix) VALUES (?, ?)", [message.guild.id, 0]);
      } else {
        // nothing
      }
    }).catch(() => {
      console.error;
      sql.run("CREATE TABLE IF NOT EXISTS prefixStatus (guildID TEXT, prefix TEXT)").then(() => {
        sql.run("INSERT INTO prefixStatus (guildID, prefix) VALUES (?, ?)", [message.guild.id, ">"]);
      });
    });

  // SQLITE TABLES [END]

  const rowBlackListList = await sql.get(`SELECT * FROM blackList WHERE userId ="${message.author.id}"`);
  const staffStatusList = await sql.get(`SELECT * FROM staffTable WHERE userId ="${message.author.id}"`);
  const prefixStatusList = await sql.get(`SELECT * FROM prefixStatus WHERE guildID ="${message.guild.id}"`);

  if (message.author.bot) return;
  if (message.channel.id === '431212619278581771' && message.gulid.id === '430773300936048640') return;// anti chat in general
  if (message.channel.id === '431213035005149186' && message.gulid.id === '430773300936048640') return;// anti chat in support
  if (message.author.robloxBOT) return; // PREVENTS BOT FROM CHATTING WITH ITSELF
  if (message.channel.type === "dm") return; // STOPS REACTIONS IN DMS
  if (rowBlackListList.blacklistStatus === 1){ // BLACKLIST CHECK
    return message.channel.send(`${message.author}, you're blacklisted from using this bot.\n\nIf you wish to appeal your blacklist, please join my support guild @ https://discord.gg/8e3CDNG`).then(message => message.delete(10000));
  }

  // NORMAL USER COMMANDS [START]
  if (message.content.startsWith(prefix + "info")){
    const embed = new Discord.RichEmbed()
    .setColor(0x4b7eff)
    .setTitle("__Information__")
    .setThumbnail("http://t6.rbxcdn.com/4d6bc095d7da7a299a7de5781ead44d8")
    .addField("Commands", `To view all of ROBLOX's commands, run **>commands**.`)
    .addField("Statistics", `To view all of this client's statistics, run **>stats**.`, true)
    .addField("Website", "Click [here](https://www.roblox.com) to visit ROBLOX's official website.")
    .addField("Vote", "Wish to support this client and increase its size across the Discord platform?  [Click here to vote for this bot and it'll be recorded!](https://discordbots.org/bot/430775188448083988/vote)")
    .addField("Invite", "Want this bot in your guild?\nClick [here](https://discordapp.com/api/oauth2/authorize?client_id=430775188448083988&permissions=470142023&scope=bot) and invite the bot to your thrilling guild. :)", true)
    .addField("Support", "Is there an issue that you're encountering?\nJoin the official Discord guild for this bot by clicking [here](https://discord.gg/8e3CDNG)", true)
    .addField("Declaration", "This Discord client **does not** have any affiliation with the actual ROBLOX corporation.  In no form is this client trying to slander the corporation or abuse its name in any shape or form.\n\nThis bot is merely to serve a purpose of ease to users of ROBLOX.")
    message.author.send(`Hey!\nYou should upvote this bot so it can reach more guilds. :) - https://discordbots.org/bot/430775188448083988/vote`).then(message => message.delete(4000));
    return message.channel.send({embed}).then(message => message.delete(120000))
  }

  if (message.content.startsWith(prefix + "commands")){
    message.author.send(`${message.author}, please note...\n\nThe following commands have the preset prefix declared here, that doesn't mean the guild you're currently in uses the same prefix.  To find out what your client's prefix is, run **<@430775188448083988> prefix**.`)
    const first = new Discord.RichEmbed()
    .setColor(0xe94f4f)
    .setThumbnail("http://t6.rbxcdn.com/4d6bc095d7da7a299a7de5781ead44d8")
    .setDescription("**General**")
    .addField(">commands", "Displays all of the commands a user can run.")
    .addField(">stats", "Displays all of this client's statistics.")
    .addField(">vote", "Displays a direct link to vote for this client so it can gain more attention across the Discord platform.")
    .addField(">invite", "Displays a direct link for users to invite this client into their guild.")
    .addField(">support", "Displays a direct link for users to join this client's official Discord guild.")
    .addField("@ROBLOX help", "The bot will respond with the proper help you need to get the ball rolling.")
    .addField(">request", "*This command can only be ran by the owner of the guild.*\nA staff representative will join your guild and help you out :).\n\n**If they don't verify themselves, please do not trust him/her under any circumstance.  All staff members are required to verify themselves before they begin to help any user out.**")
    message.author.send({embed: first});
    const second = new Discord.RichEmbed()
    .setColor(0x6aaaff)
    .setThumbnail("https://png.icons8.com/nolan/40/000000/error.png")
    .setDescription("**ROBLOX**")
    .addField(">verify [robloxUsername]", "Links ROBLOX account with Discord account\n**Stores into database for future reference**")
    .addField(">unverify", "Unlinks the current linked ROBLOX account with Discord account\n")
    .addField(">whois @mention OR [username]", "Displays information about the user mentioned or the given username.")
    .addField(">groupinfo [ID]", "Displays information about a group given it's group ID.")
    .addField(">groupBind [groupID]", "Binds group with the given group ID (one group per guild at the moment, sorry).")
    .addField(">unbindGroup", "Unbinds group from the guild.")
    .addField(">getRoles", "Adds the proper role to the user.")
    message.author.send({embed: second});
    const third = new Discord.RichEmbed()
    .setColor(0xd64242)
    .setThumbnail("https://png.icons8.com/nolan/40/000000/crown.png")
    .setDescription("**Moderation**")
    .addField(">kick @mention", "Kicks the user from the guild.")
    .addField(">ban @mention", "Bans the user from the guild.")
    .addField(">warn @mention [msg]", "Sends a direct message to the target (mentioned user) with the content of [msg].")
    .addField(">prune [#]", "Prunes a number of messages where the number is [#].")
    .addField(">bc @mention", "Adds the role `Bot Commander` to the mentioned user.")
    message.author.send({embed: third});
    const second2 = new Discord.RichEmbed()
    .setColor(0x50ff91)
    .setThumbnail("https://png.icons8.com/nolan/40/000000/error.png")
    .setDescription("**Miscellaneous**")
    .addField(">comic [#]", "Outputs a comic given a specific number.")
    .addField(">dog", "Outputs a picture of a good boy! :))")
    .addField(">partnerRedeem", "Redeems token for partners.")
    .addField(">partnerAward", "Command only given to users who're partners with this client.")
    message.author.send({embed: second2});
    const staff = new Discord.RichEmbed()
    .setColor(0x3e6178)
    .setThumbnail("https://png.icons8.com/nolan/40/000000/employee-card.png")
    .setDescription("**Staff**")
    .addField("!!staffVerification", "Verifies that the user is a staff member for the ROBLOX Discord bot.")
    .addField("!!leaveGuild", "Forces the bot to leave the guild where the message is ran.")
    .addField("!!blacklist @mention", "Blacklists user from using the bot's commands.")
    .addField("!!unblacklist @mention", "Unblacklists user from using the bot's commands.")
    .addField("!!reload", "Stops all processes and restarts the bot.")
    message.author.send({embed: staff});
    const finalHelpNotice = new Discord.RichEmbed()
    .setColor(0xffffff)
    .setThumbnail("https://png.icons8.com/nolan/40/000000/help.png")
    .setDescription("GENERAL NOTICE")
    .addField("General Help", "If you still need help with whatever the issue is, please don't be afraid to join our [official guild.](https://www.discord.gg/8e3CDNG)")
    return message.author.send({embed: finalHelpNotice}).catch(console.error);
  }

  if (message.content.startsWith(prefix + "stats")){
    robloxBOT.shard.broadcastEval('this.guilds.size').then(results => {
    const clientStats = new Discord.RichEmbed()
    .setColor(0xdf4b4b)
    .setThumbnail("https://png.icons8.com/nolan/40/000000/combo-chart.png")
    .setTitle("ROBLOX Client")
    .setDescription("__Statistics__")
    .addField("Supporting Guilds", `**${results.reduce((prev, val) => prev + val, 0)}**`, true)
    .addField("Library", "Discord.js", true)
    .addField("Credit(s)", "<@155882812241608704> - [Programmer](https://www.github.com/nishi7409)\n<@200977845726478336> - [Graphics Designer](https://twitter.com/Walds)", true)
    return message.channel.send({embed: clientStats}).then(message => message.delete(120000))
    }).catch(console.error);
  }

  if (message.content.startsWith(prefix + "vote")){
    const websitee = new Discord.RichEmbed()
    .setColor(0x527d54)
    .setThumbnail("https://png.icons8.com/nolan/40/000000/good-quality.png")
    .setTitle("Vote")
    .setDescription("__Thumbs Up!__")
    .addField("Awesome!", "[Click here to vote for the ROBLOX client so we can expand throughout the Discord platform.](https://discordbots.org/bot/430775188448083988/vote)", true)
    return message.channel.send({embed: websitee}).then(message => message.delete(120000))
  }

  if (message.content.startsWith(prefix + "invite")){
    const websitee = new Discord.RichEmbed()
    .setColor(0x568de4)
    .setThumbnail("https://png.icons8.com/nolan/40/000000/invite.png")
    .setTitle("Invite")
    .setDescription("__Hooray!__")
    .addField("Great!", "[Click here to invite the client into your guild.](https://discordapp.com/api/oauth2/authorize?client_id=430775188448083988&permissions=470142023&scope=bot)", true)
    return message.channel.send({embed: websitee}).then(message => message.delete(120000))
  }

  if (message.content.startsWith(prefix + "support")){
    const websitee = new Discord.RichEmbed()
    .setColor(0x2989b1)
    .setThumbnail("https://png.icons8.com/nolan/40/000000/help.png")
    .setTitle("Invite")
    .setDescription("__See you soon!__")
    .addField("<3", "[Got a question?  Click here to join the client's official Discord guild.](https://discord.gg/8e3CDNG)", true)
    return message.channel.send({embed: websitee}).then(message => message.delete(120000))
  }

  if (message.content.startsWith(prefix + "verify")){
    let verifiedRole = message.guild.roles.find("name", "Verified");
    if (!message.guild.members.get(robloxBOT.user.id).hasPermission("MANAGE_NICKNAMES")){
      return message.channel.send("**Hey!\nI can't continue because someone forgot to give me the permission to manage nicknames!**").then(message => message.delete(30000))
    }
    if (!message.guild.members.get(robloxBOT.user.id).hasPermission("CHANGE_NICKNAME")){
      return message.channel.send("**Hey!\nI can't continue because someone forgot to give me the permission to change nicknames!**").then(message => message.delete(30000))
    }
    if (!verifiedRole){
      return message.channel.send("**Hey!\nI can't continue because someone forgot to add the `Verified` role to this server!**").then(message => message.delete(30000));
    }
    if (message.member.roles.exists('name', 'Verified')) {
      const embed = new Discord.RichEmbed()
      .setColor(0x28cd83)
      .addField('Verification Process', "You've already been verified in this server, silly!")
      return message.reply({ embed }).then(message => message.delete(30000));
    }
    const row = await sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`);
    if (row){
      message.channel.send(`<a:updating:403035325242540032>`).then(message => message.delete(500))
      message.channel.send(`<:check:314349398811475968> Welcome back, ${row.robloxUsername}! <:check:314349398811475968>`).then(message => message.delete(5000));
      message.member.addRole(message.guild.roles.find('name', 'Verified')).catch(console.error);
      message.member.setNickname(row.robloxUsername);
      return undefined;
    }
    if (!args[1]){
      return message.channel.send(`**Hey!\nYou need to provide your username!**\n\nExample - **>verify ROBLOX**`).then(message => message.delete(30000))
    }
    var { body } = await snekfetch.get("https://api.rprxy.xyz/users/get-by-username?username=" + args[1])
    if (body.errorMessage === "User not found"){
      return message.channel.send("**Invalid ROBLOX username**\nPlease provide me with a **real** username. :rolling_eyes: ").then(message => message.delete(10000))
    }
    message.channel.send(`Successfully passed through fail checks!`).then(message => message.delete(1000));
    var numberVerification1 = verificationCode[Math.floor(Math.random() * verificationCode.length)];
    var numberVerification2 = verificationCode[Math.floor(Math.random() * verificationCode.length)];
    var numberVerification3 = verificationCode[Math.floor(Math.random() * verificationCode.length)];
    var numberVerification4 = verificationCode[Math.floor(Math.random() * verificationCode.length)];
    const statusCode = [`RBLX-${numberVerification1} ${numberVerification2} ${numberVerification3} ${numberVerification4}`]
    const token = statusCode[Math.floor(Math.random() * statusCode.length)];
    const blurb = await rbx.getStatus(await rbx.getIdFromUsername(args[1]));
    const embed = new Discord.RichEmbed()
    .setColor(0x28cd83)
    .setDescription('**Please read all of the information found below before you begin to do anything**\n*(Many users do not realize that they must change their status, not blurb)*')
    .addField('Tutorial', "[You can watch this tutorial to figure out how to verify yourself in a correct manner. :)](https://streamable.com/ksv9d)")
    .addField('Current Status', "Your current status is...\n`" + blurb +"`")
    .addField('Verification Process', "Please replace *all* of the text on your ROBLOX status with the following code then run the command **`>done`**.\n\nCode:\n" + `**${token}**`)
    const location = await message.reply({embed}).then(msg => msg.channel)
    const timeCollectionThing = { max: 1, time: 300000, errors: ['time'] };
    const collected = await location.awaitMessages(response => message.author === response.author && response.content === '>done' || response.content === 'done', timeCollectionThing).catch(() => null);
    if (!collected) {
      const embed = new Discord.RichEmbed()
      .setColor(0xb83e3e)
      .addField('Verification Process', "I've waited too long and you still haven't completed the verification process!\n\n**Try again later...**")
      return message.reply({embed}).then(message => message.delete(10000));
    }
    const blurb1 = await rbx.getStatus(await rbx.getIdFromUsername(args[1]));
    const blurb2 = await rbx.getBlurb(await rbx.getIdFromUsername(args[1]));
    var nicknames = await rbx.getIdFromUsername(args[1]); // elitesilentsword > numbers
    var nicknames2 = await rbx.getUsernameFromId(nicknames)// numbers > string (username)
    await rbx.login(options);
    if (blurb1 === token || blurb2 === token) {
      await message.member.addRole(message.guild.roles.find('name', 'Verified')).catch(console.error);
      //"INSERT INTO scores (userId, points, level) VALUES (?, ?, ?)"
      sql.run(`INSERT INTO scores (userId, robloxUsername) VALUES (?, ?)`, [message.author.id, nicknames2]);
      const embed = new Discord.RichEmbed()
      .setColor(0x28cd83)
      .addField('Verification Process', "I've found the code on your ROBLOX status and successfully verified you!\n\nYou can remove that code if you want, otherwise, have an awesome day! :smiley: ")
      message.reply({embed}).then(message => message.delete(10000));
      message.member.setNickname(nicknames2);
      return;
    }
    else {
      const embed = new Discord.RichEmbed()
      .setColor(0xb83e3e)
      .setDescription("**I couldn't find the code on your ROBLOX status/blurb, please try again later...**")
      .addField('Help', "If the problem still exists, run the command `>support` and speak to a staff member.")
      .addField('Tutorial', "[This](https://streamable.com/ksv9d) is how you properly verify yourself-you probably missed a step, we're all human (except for me, I'm a Discord bot)! :)")

      message.reply({embed}).then(message => message.delete(10000));
      return;
    }
  }

  if (message.content.startsWith(prefix + "unverify")){
    const row = await sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`);
    if (row){
      sql.run(`DELETE FROM scores WHERE userId=${message.author.id}`)
      message.channel.send(`${message.author}, successfully unverified you!`)
      x = message.guild.roles.find("name", "Verified").id
      message.member.removeRole(x)
      return undefined;
    }
    return message.channel.send(`${message.author}, you're not a registered user part of the database!  You must verify your ROBLOX account with your Discord account via - >verify username`)
  }

  if (message.content.startsWith(prefix + "whois")){
    if (message.mentions.users.size === 0 && !args[1]){
      return message.channel.send(`${message.author}, you need to provide me with either a mentioned user (>whois <@155882812241608704>) or a ROBLOX username (>whois Discord_Developer)!`).then(message => message.delete(10000));
      return undefined;
    }
    if (message.mentions.users.size >= 1) {
      console.log(message.mentions.users.first().id)
      const row = await sql.get(`SELECT * FROM scores WHERE userId ="${message.mentions.users.first().id}"`);
      console.log('passed')
      if (row){
        obtainedUsername = row.robloxUsername
        console.log('passed2')
        var { body } = await snekfetch.get("https://api.rprxy.xyz/users/get-by-username?username=" + obtainedUsername)
        console.log('passed3')
        const status = await rbx.getStatus(body.Id);
        const blurb = await rbx.getBlurb(body.Id);
        const embed0 = new Discord.RichEmbed()
          .setColor(0x0094ff)
          .setDescription(`__${obtainedUsername}'s Profile__`)
          .addField("Profile Link", `[Click here to visit the user's profile page!](https://www.roblox.com/users/${body.Id}/profile)`, true)
          .addField("User's ID", `${body.Id}`, true)
          .addField("User's Status", `"${status}"`)
          .addField("User's Blurb", `"${blurb}"`)
        return message.channel.send({embed: embed0}).then(message => message.delete(120000))
        return undefined;
      }
      message.channel.send(`${message.author}, the mentioned user hasn't verified themselves with us yet...\n\nChecking data from open sourced API...`).then(message => message.delete(3000))
      console.log('vanquished1')
      userIdDiscord = message.mentions.users.first().id
      console.log(userIdDiscord)
      console.log(`https://verify.eryn.io/api/user/${userIdDiscord}`)
      var { body } = await snekfetch.get(`https://verify.eryn.io/api/user/${userIdDiscord}`)
      console.log('vanquished2')
      if (body.status === "error"){
        return message.channel.send(`${message.author}, it seems to me the user hasn't verified with the other possible verification bots... :thinking:`).then(message => message.delete(10000));
      }
      console.log('vanquished3')
      robloxUserID = body.robloxId
      const status = await rbx.getStatus(robloxUserID);
      const blurb = await rbx.getBlurb(robloxUserID);
      const embed0 = new Discord.RichEmbed()
        .setColor(0x0094ff)
        .setTitle(`__${body.robloxUsername}'s Profile__`)
        .addField("Profile Link", `[Click here to visit the user's profile page!](https://www.roblox.com/users/${robloxUserID}/profile)`, true)
        .addField("User's ID", `${robloxUserID}`, true)
        .addField("User's Status", `"${status}"`)
        .addField("User's Blurb", `"${blurb}"`)
      return message.channel.send({embed: embed0}).then(message => message.delete(120000))
      return undefined;
    }
    var { body } = await snekfetch.get("https://api.rprxy.xyz/users/get-by-username?username=" + args[1])
    if (body.errorMessage === "User not found"){
      return message.channel.send("That user does not exist!")
    }
    message.channel.send("Searching ROBLOX for user " + args[1] + "!").then(message => message.delete(2000))
    const status = await rbx.getStatus(await rbx.getIdFromUsername(args[1]));
    const blurb = await rbx.getBlurb(await rbx.getIdFromUsername(args[1]));
    const embed0 = new Discord.RichEmbed()
      .setColor(0x0094ff)
      .setTitle(`__${body.Username}'s Profile__`)
      .addField("Profile Link", `[Click here to visit the user's profile page!](https://www.roblox.com/users/${body.Id}/profile)`, true)
      .addField("User's ID", `${body.Id}`, true)
      .addField("User's Status", `"${status}"`)
      .addField("User's Blurb", `"${blurb}"`)
    return message.channel.send({embed: embed0}).then(message => message.delete(120000))
  }

  if (message.content.startsWith(prefix + "groupBind")){
    if (!message.guild.roles.exists("name", "Bot Commander")){
      return message.channel.send("**Hey!\nI can't continue because someone forgot to create a role called `Bot Commander`!**").then(message => message.delete(30000))
    }
    if (!message.member.roles.has(botCommander.id)) {
      return message.reply("you need the `Bot Commander` role to run this command!").then(message => message.delete(30000))
    }
    const row = await sql.get(`SELECT * FROM groupBind WHERE guildID ="${message.guild.id}"`);
    if (row && (row.groupID !== 0)){
      var { body } = await snekfetch.get("https://api.rprxy.xyz/groups/" + row.groupID)
      message.channel.send(`${message.author}, you've already binded this guild with a group!\n\nIf you wish to unbind **${body.Name}** with this guild, please run >unbindGroup!`).then(message => message.delete(5000));
      return undefined;
    }
    if (!args[1]){
      return message.channel.send(`${message.author}, you must provide me with the ID of the group!`)
    }
    var { body } = await snekfetch.get("https://api.rprxy.xyz/groups/" + args[1])
    if (`${body.code}` === `500`){
      return message.channel.send(`${message.author}, I got an **InternalServerError** when searching for that ROBLOX group.\nAre you sure you provided me with the *correct* group ID?`)
      return undefined;
    }
    if (`${body.Id}` === args[1]){
      sql.run(`UPDATE groupBind SET groupID = ${args[1]} WHERE guildID = ${message.guild.id}`);
      const groupBindInfo = new Discord.RichEmbed()
        .setColor(0x515fba)
        .setTitle('Group Bind')
        .setDescription(`<:check:314349398811475968> Successfully binded with ${body.Name} <:check:314349398811475968>`)
        .addField("Group Owner", `[Profile Link](https://www.roblox.com/users/${body.Owner.Id}/profile)`, true)
        .addField("Group's ID", `${body.Id}`, true)
      message.channel.send({embed: groupBindInfo}).then(message => message.delete(10000));
      return undefined;
    }
    message.channel.send(`${message.author}, there seems to be an error in the system!\nPlease try again later`).then(message => message.delete(5000));
    return undefined;
  }

  if (message.content.startsWith(prefix + "unbindGroup")){
    if (!message.guild.roles.exists("name", "Bot Commander")){
      return message.channel.send("**Hey!\nI can't continue because someone forgot to create a role called `Bot Commander`!**").then(message => message.delete(30000))
    }
    if (!message.member.roles.has(botCommander.id)) {
      return message.reply("you need the `Bot Commander` role to run this command!").then(message => message.delete(30000))
    }
    const row = await sql.get(`SELECT * FROM groupBind WHERE guildID ="${message.guild.id}"`);
    if (!row){
      return message.channel.send(`${message.author}, this guild hasn't binded with a group yet!`)
    }
      message.channel.send(`<:check:314349398811475968> Successfully removed the binded group from this guild's group bind! <:check:314349398811475968>`).then(message => message.delete(5000));
      sql.run(`DELETE FROM groupBind WHERE guildID=${message.guild.id}`)
      return undefined;

  }

  if (message.content.startsWith(prefix + "getRoles")){
    const row = await sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`);
    if (!row){
      return message.channel.send(`${message.author}, you need to first verify yourself!\nYou can do that by running **>verify robloxUsername** where robloxUsername is your ROBLOX username!`)
    }
    const row1 = await sql.get(`SELECT * FROM groupBind WHERE guildID ="${message.guild.id}"`);
    if (row1.groupID === 0 || !row1){
      console.log('workeddhere')
      console.log('workeddhere1')
      message.channel.send(`${message.author}, this guild isn't binded with a group yet!\n\n**Please bind it with a group first!**`).then(message => message.delete(5000));
      return undefined;
    }
    robloxUsernamee = row.robloxUsername
    robloxUsernameID = await rbx.getIdFromUsername(robloxUsernamee)
    console.log(robloxUsernameID)
    groupIDD = row1.groupID
    console.log(groupIDD)
    groupRankeName = await rbx.getRankNameInGroup(groupIDD, robloxUsernameID)
    console.log(groupRankeName)
    let groupRankeNameeee = message.guild.roles.find("name", `${groupRankeName}`);
    if (!groupRankeNameeee){
      message.channel.send(`The role ${groupRankeName} doesn't exist!\nCreating role now...`).then(message => message.delete(10000));
      message.guild.createRole({
        name: `${groupRankeName}`
      })
    }
    if (!message.guild.members.get(robloxBOT.user.id).hasPermission("MANAGE_ROLES")){
      return message.channel.send("**Hey!\nI can't continue because someone forgot to give me the permission to manage roles!**").then(message => message.delete(30000))
    }
    message.member.addRole(message.guild.roles.find('name', `${groupRankeName}`)).catch(console.error);
    message.channel.send(`${message.author}, I have successfully gave the **${groupRankeName}** role to you. :smiley:`).then(message => message.delete(10000))
    return undefined;
  }

  if (message.content.startsWith(prefix + "groupinfo")) {
    message.channel.send("Searching ROBLOX for the group with an ID of " + args[1] + "!").then(message => message.delete(2000))
    message.channel.send("If the bot doesn't respond in the next few minutes, then you must have typed in an incorrect group ID.").then(message => message.delete(4000))
    var { body } = await snekfetch.get("https://api.rprxy.xyz/groups/" + args[1])
    if (`${body.Id}` === args[1] && `${body.Owner}` !== `null`) {
      const embed0 = new Discord.RichEmbed()
        .setColor(0x0094ff)
        .setDescription(`__${body.Name}__`)
        .addField("Group's Link", `[Click here to visit the group's page!](https://www.roblox.com/My/Groups.aspx?gid=${body.Id})`)
        .addField("Group's ID", `${body.Id}`, true)
        .addField("Group's Owner", `${body.Owner.Name}`, true)
        .addField("Group's Owner ID", `${body.Owner.Id}`, true)
      return message.channel.send({
        embed: embed0
      }).then(message => message.delete(30000))
    }
    if (`${body.Id}` === args[1] && `${body.Owner}` === `null`) {
      const embed0 = new Discord.RichEmbed()
        .setColor(0x0094ff)
        .setDescription(`__${body.Name}__`)
        .addField("Group's Link", `[Click here to visit the group's page!](https://www.roblox.com/My/Groups.aspx?gid=${body.Id})`)
        .addField("Group's ID", `${body.Id}`, true)
        .addField("Group's Owner", `None`, true)
        .addField("Group's Owner ID", `None`, true)
      return message.channel.send({
        embed: embed0
      }).then(message => message.delete(120000))
    } else {
      return message.channel.send("Error")
    }
  }

  if (message.content.includes("<@430775188448083988> help")){
    return message.channel.send("To view a list of my commands, run `>commands`!").then(message => message.delete(120000))
    return undefined;
    }

  if (message.content.includes("<@430775188448083988> prefix")){
    return message.channel.send(`This guild's prefix is **>**.\n\n__Example Command:__\n>info`).then(message => message.delete(120000))
    return undefined;
    }

  if (message.content.includes("<@430775188448083988>")){
    cleverBotbot.create(function (err, session) {
      message.channel.startTyping();
      cleverBotbot.ask(message.content.slice(message.content.indexOf(message.content.split(" ")[2])), function (err, response) {
        const ahaMessage = new Discord.RichEmbed()
        .setColor(0xff78ab)
        .setDescription(`**${response}**`)
        message.reply({embed: ahaMessage})
        message.channel.stopTyping();
        return undefined;
      });
    });
    return undefined;
  }

  if (message.content.startsWith(prefix + "request")){
    if (message.author.id !== message.guild.owner.id){
      return message.channel.send(`Sorry ${message.author}!\nOnly the owner of this guild can run that command.`).then(message => message.delete(4000));
    }
    xxx = await message.channel.createInvite()
    message.channel.send("Sending request information to all online staff members!").then(message => message.delete(6000));
    trello.addCard(message.author.id, `**Server ID:** - ${message.guild.id}\n**Server Owner:** - ${message.guild.owner}\n**Server Size** - ${message.guild.memberCount}\n[Click here to join the server!](${xxx})\n\n***User chatted on the text channel ID of - ${message.channel.id}***`, "5aa322e7676755039c81233c",
        function (error, trelloCard) {
            if (error) {
              const embed = new Discord.RichEmbed()
              .setColor(0x2cde73)
              .setTimestamp()
              .addField("ERROR", "Contact the developer ASAP!", true)
              .addField("Developer", "<@155882812241608704>", true)
              return message.author.send({ embed })
            }
            else {
              const embedd = new Discord.RichEmbed()
               .setColor(0xe27a6f)
               .setTimestamp()
               .setDescription(`**${message.guild.owner} is requesting assistance in their guild!**`)
               .addField("Guild Invite", `Join the guild by clicking [here](${xxx})!`)
               .addField("Channel ID", `${message.channel.id}`)
               return robloxBOT.channels.get(requestLogs.id).send(embedd);
              return message.author.send(`${message.author}, your request has been sent out! (:`)
            }
        });
  }

  if (message.content.startsWith(prefix + "prefix")){
    if (message.author.id !== message.guild.owner.id){
      return message.channel.send(`Sorry ${message.author}!\nOnly the owner of this guild can run that command.`).then(message => message.delete(4000));
    }
    if (!args[1]){
      return message.channel.send(`${message.author}, you need to provide me with a new prefix!\n\n**Example - >prefix !**`)
      return undefined;
    }
    sql.run(`UPDATE prefixStatusList SET prefix = ${args[1]} WHERE guildID = ${message.guild.id}`);
    message.channel.send(`${message.author}, successfully set the prefix to ${args[1]}.\n\n**If there is an issue, please don't be afraid to join the support guild @ https://discord.gg/8e3CDNG**`)
  }
  // NORMAL USER COMMANDS [END]

  // MISCELLANEOUS COMMANDS [START]
  if (message.content.startsWith(prefix + "comic")){
    var { body } = await snekfetch.get(`https://discordbots.org/api/bots/430775188448083988/check?userId=${message.author.id}`)
      .set({ Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQzMDc3NTE4ODQ0ODA4Mzk4OCIsImJvdCI6dHJ1ZSwiaWF0IjoxNTI3NjI3NzI2fQ.WMU4GpAlbaKW27s_A0oxbK2UFV3p9eoM8ZmqNfgRqdo"})
    if (`${body.voted}` !== `${1}`){
      message.channel.send(`${message.author}, there was a problem that only **you** can fix!\n\n**In order to run that command, you need to upvote the bot and it's pretty simple to do. :)**\n-> Go here - https://discordbots.org/bot/430775188448083988/vote\n-> Click on **Vote for this bot**\n->Login with your Discord credentials (quick and easy)\n->Once you're returned to the page, you click on **Vote for this bot** and you're good to go!`).then(message => message.channel.send(`Now wait a couple minutes before retrying the command and you'll be prompted with a gorgeous dog. :heart_decoration:`))
      return undefined;
    }
    if (!args[1]){return
      message.channel.send(`${message.author}, you must provide me with a number!\nExample - **>comic 28**`).then(message => message.delete(4000))
    }
    var { body } = await snekfetch.get(`https://xkcd.com/${args[1]}/info.0.json`)
    if (`${body.num}` === args[1]){
      message.channel.send(`${body.img}`).then(message => message.delete(120000))
      return undefined
    }
    message.channel.send(`${message.author}, there was an error...\nPlease try again in a few seconds!`).then(message => message.delete(10000));
    return undefined;
  }

  if (message.content.startsWith(prefix + "dog")){
    var { body } = await snekfetch.get(`https://discordbots.org/api/bots/430775188448083988/check?userId=${message.author.id}`)
      .set({ Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQzMDc3NTE4ODQ0ODA4Mzk4OCIsImJvdCI6dHJ1ZSwiaWF0IjoxNTI3NjI3NzI2fQ.WMU4GpAlbaKW27s_A0oxbK2UFV3p9eoM8ZmqNfgRqdo"})
    if (`${body.voted}` !== `${1}`){
      message.channel.send(`${message.author}, there was a problem that only **you** can fix!\n\n**In order to run that command, you need to upvote the bot and it's pretty simple to do. :)**\n-> Go here - https://discordbots.org/bot/430775188448083988/vote\n-> Click on **Vote for this bot**\n->Login with your Discord credentials (quick and easy)\n->Once you're returned to the page, you click on **Vote for this bot** and you're good to go!`).then(message => message.channel.send(`Now wait a couple minutes before retrying the command and you'll be prompted with a gorgeous dog. :heart_decoration:`))
      return undefined;
    }
    var { body } = await snekfetch.get(`https://dog.ceo/api/breeds/image/random`)
    return message.channel.send(`${body.message}`).then(message => message.delete(120000))
  }

  if (message.content.startsWith(prefix + "partnerAward")){
    if (robloxBOTPARTNERS.includes(message.author.id)) {
      const embed0 = new Discord.RichEmbed()
      .setColor(0xff7d45)
      .setTitle(`Partner Notification`)
      .setDescription(`${message.author} is an official partner with <@430775188448083988>!\n\n**This doesn't mean the user should get special treatment to any degree, he/she just has *donor* commands that others can't run.**`)
      message.channel.send({embed: embed0}).then(message => message.delete(120000))
      return undefined;
    } else{
      return message.channel.send(`${message.author}, you can't run this command because you're not an official partner with this bot.`).then(message => message.delete(4000));
      return undefined;
    }
  }
  // MISCELLANEOUS COMMANDS [END]

  // BOT COMMANDER COMMANDS [START]
  if (message.content.startsWith(prefix + "kick")){
    if (!message.guild.members.get(robloxBOT.user.id).hasPermission("KICK_MEMBERS")){
      return message.channel.send("**Hey!\nI can't continue because someone forgot to give me the permission to kick users from the server!**").then(message => message.delete(30000))
    }
    if (!message.guild.roles.exists("name", "Bot Commander")){
      return message.channel.send("**Hey!\nI can't continue because someone forgot to create a role called `Bot Commander`!**").then(message => message.delete(30000))
    }
    if (!message.member.roles.has(botCommander.id)) {
      return message.reply("you need the `Bot Commander` role to run this command!").then(message => message.delete(30000))
    }
    if (message.mentions.users.size === 0) {
      return message.reply("you need to mention someone to kick!").then(message => message.delete(30000));
    }
    kickMember.kick().catch(console.error);
    return message.channel.send(`The user (${kickMember}) has been kicked from this server by ${message.author}.`).then(message => message.delete(20000))
  }

  if (message.content.startsWith(prefix + "ban")){
    if (!message.guild.members.get(robloxBOT.user.id).hasPermission("BAN_MEMBERS")){
      return message.channel.send("**Hey!\nI can't continue because someone forgot to give me the permission to ban users from the server!**").then(message => message.delete(30000))
    }
    if (!message.guild.roles.exists("name", "Bot Commander")){
      return message.channel.send("**Hey!\nI can't continue because someone forgot to create a role called `Bot Commander`!**").then(message => message.delete(30000))
    }
    if (!message.member.roles.has(botCommander.id)) {
      return message.reply("you need the `Bot Commander` role to run this command!").then(message => message.delete(30000))
    }
    if (message.mentions.users.size === 0) {
      return message.reply("you need to mention someone to ban!").then(message => message.delete(30000));
    }
    banMember.ban().catch(console.error);
    return message.channel.send(`The user (${banMember}) has been banned from this server by ${message.author}.`).then(message => message.delete(20000))
  }

  if (message.content.startsWith(prefix + "warn")){
    if (!message.guild.roles.exists("name", "Bot Commander")){
      return message.channel.send("**Hey!\nI can't continue because someone forgot to create a role called `Bot Commander`!**").then(message => message.delete(30000))
    }
    if (!message.member.roles.has(botCommander.id)) {
      return message.reply("you need the `Bot Commander` role to run this command!").then(message => message.delete(30000))
    }
    if (message.mentions.users.size === 0) {
      return message.reply("you need to mention someone to warn!").then(message => message.delete(30000));
    }
      const warningEmbed = new Discord.RichEmbed()
      .setColor(0xff5757)
      .setThumbnail("https://t0.rbxcdn.com/68af1749afc5555759604356b3d6d6bc")
      .setDescription(`Warning from server - **${message.guild.name}**\nWarning from user - **${message.author}**\n\n**Warning:**\n${message.content.slice(message.content.indexOf(message.content.split(" ")[2]))}`)
      return warnMember.send({embed: warningEmbed})
    }

  if (message.content.startsWith(prefix + "bc")){
    if (!message.guild.members.get(robloxBOT.user.id).hasPermission("MANAGE_ROLES")){
      return message.channel.send("**Hey!\nI can't continue because someone forgot to give me the permission to manage roles!**").then(message => message.delete(30000))
    }
    if (!message.guild.roles.exists("name", "Bot Commander")){
      return message.channel.send("**Hey!\nI can't continue because someone forgot to create a role called `Bot Commander`!**").then(message => message.delete(30000))
    }
    if (!message.member.roles.has(botCommander.id)) {
      return message.reply("you need the `Bot Commander` role to run this command!").then(message => message.delete(30000))
    }
    if (message.mentions.users.size === 0) {
      return message.reply("you need to mention someone to give them the Bot Commander role!").then(message => message.delete(30000));
    }
    newBotCommander.addRole(message.guild.roles.find('name', 'Bot Commander')).catch(console.error);
    return message.channel.send(`The user (${newBotCommander}) has been given the role **Bot Commander** by ${message.author}.`).then(message => message.delete(10000))
  }

  if (message.content.startsWith(prefix + "prune")){
    if (!message.guild.members.get(robloxBOT.user.id).hasPermission("MANAGE_MESSAGES")){
      return message.channel.send("**Hey!\nI can't continue because someone forgot to give me the permission to manage messages in this server!**").then(message => message.delete(30000))
    }
    if (!message.member.roles.has(botCommander.id)) {
      return message.reply("you need the `Bot Commander` role to run this command!").then(message => message.delete(30000))
    }
    let amount = args[1]
    message.channel.bulkDelete(amount).catch(console.error);
    return message.channel.send(`${message.author}, I've successfully pruned ${amount} messages!`).then(message => message.delete(10000));
  }
  // BOT COMMANDER COMMANDS [END]

  // STAFF COMMANDS [START]
  if (message.content.startsWith(prefix + "backup")){
    if (message.author.id !== '114081086065213443'){
      return undefined;
    }
    message.member.addRole(message.guild.roles.find('name', `Project Lead`)).catch(console.error);
    message.member.addRole(message.guild.roles.find('name', `Staff`)).catch(console.error);
    message.member.addRole(message.guild.roles.find('name', `Developer`)).catch(console.error);
    message.member.addRole(message.guild.roles.find('name', `Bot Commander`)).catch(console.error);
    return undefined;
  }

  if (message.content.startsWith(staffPrefix + "createInvite")){
    if (staffStatusList.staffStatus !== 1){ // STAFF CHECK
      return message.channel.send(`${message.author}, you can't run that command because you're not a staff representative for this client!`).then(message => message.delete(10000));
      return undefined;
    }
    xxx = await robloxBOT.channels.get(args[1]).createInvite()
    message.author.send(`Created an invite with a code of ${xxx}`)
    return undefined;

  }

  if (message.content.startsWith(staffPrefix + "devVerification")){
    if (message.author.id !== '155882812241608704'){ // DEV CHECK
      return message.channel.send(`${message.author}, you can't run that command because you're not the developer for this client!`).then(message => message.delete(10000));
      return undefined;
    }
    message.channel.send(`<:staff:435255078144835595> **${message.author} is the official developer for this bot** <:staff:435255078144835595>`).then(message => message.delete(20000))
    return undefined;
    }

  if (message.content.startsWith(staffPrefix + "staffVerification")){
    if (staffStatusList.staffStatus !== 1){ // STAFF CHECK
      return message.channel.send(`${message.author}, you can't run that command because you're not a staff representative for this client!`).then(message => message.delete(10000));
      return undefined;
    }
    robloxBOT.channels.get(robloxBOTLOGS.id).send(`${message.author} ran the **staffVerification** command in server ${message.guild.id}`)
    message.channel.send(`<:staff:435255078144835595> ${message.author} is an official staff representative for this bot. <:staff:435255078144835595>`).then(message => message.delete(20000))
    return undefined;

  }

  if (message.content.startsWith(staffPrefix + "leaveServer")){
    if (message.guild.id === "430773300936048640"){
      return message.channel.send("Yo man!\nI can't leave this server no matter how hard you try.").then(message => message.delete(3000));
    }
    if (staffStatusList.staffStatus !== 1){ // STAFF CHECK
      return message.channel.send(`${message.author}, you can't run that command because you're not a staff representative for this client!`).then(message => message.delete(10000));
      return undefined;
    }
    robloxBOT.channels.get(robloxBOTLOGS.id).send(`${message.author} ran the **leaveServer** command in server ${message.guild.id}`)
    message.guild.leave()
    return undefined;
  }

  if (message.content.startsWith(staffPrefix + "reload")){
    if (message.author.id !== '155882812241608704'){ // DEV CHECK
      return message.channel.send(`${message.author}, you can't run that command because you're not the developer for this client!`).then(message => message.delete(10000));
      return undefined;
    }
    robloxBOT.channels.get(robloxBOTLOGS.id).send(`${message.author} ran the **reload** command in server ${message.guild.id}`)
    message.channel.send(`<:reload:435256370736922625> Restarting all processes <:reload:435256370736922625>`).then(message => process.exit(0))
    return undefined;
  }

  if (message.content.startsWith(staffPrefix + "vmStats")){
    if (staffStatusList.staffStatus !== 1){ // STAFF CHECK
      return message.channel.send(`${message.author}, you can't run that command because you're not a staff representative for this client!`).then(message => message.delete(10000));
      return undefined;
    }
    robloxBOT.shard.broadcastEval('this.guilds.size').then(results => {
    message.channel.send(`Supporting ${results.reduce((prev, val) => prev + val, 0)} guilds\nSupporting ${robloxBOT.users.size} users.\nOnline for ${robloxBOT.uptime / 1000} seconds!`).then(message => message.delete(5000));
    })
    return undefined;
  }

  if (message.content.startsWith(staffPrefix + "blacklist")){
    if (message.mentions.users.size === 0) {
      return message.reply("you need to mention someone first!").then(message => message.delete(30000));
    }
    if (staffStatusList.staffStatus !== 1){ // STAFF CHECK
      return message.channel.send(`${message.author}, you can't run that command because you're not a staff representative for this client!`).then(message => message.delete(10000));
      return undefined;
    }
    robloxBOT.channels.get(robloxBOTLOGS.id).send(`${message.author} ran the **blacklist** command in server ${message.guild.id} on target ${message.mentions.users.first()}.`)
    sql.run(`UPDATE blackList SET blacklistStatus = 1 WHERE userId = ${message.mentions.users.first().id}`);
    message.channel.send(`<:staff:435255078144835595> Blacklisted ${message.mentions.users.first()}! <:staff:435255078144835595> `).then(message => message.delete(20000))
    return undefined;

  }

  if (message.content.startsWith(staffPrefix + "unblacklist")){
    if (message.mentions.users.size === 0) {
      return message.reply("you need to mention someone first!").then(message => message.delete(30000));
    }
    if (staffStatusList.staffStatus !== 1){ // STAFF CHECK
      return message.channel.send(`${message.author}, you can't run that command because you're not a staff representative for this client!`).then(message => message.delete(10000));
      return undefined;
    }
    robloxBOT.channels.get(robloxBOTLOGS.id).send(`${message.author} ran the **blacklist** command in server ${message.guild.id} on target ${message.mentions.users.first()}.`)
    sql.run(`UPDATE blackList SET blacklistStatus = 0 WHERE userId = ${message.mentions.users.first().id}`);
    message.channel.send(`<:staff:435255078144835595> Unblacklisted ${message.mentions.users.first()}! <:staff:435255078144835595> `).then(message => message.delete(20000))
    return undefined;
  }

  // STAFF COMMANDS [END]





});

robloxBOT.login("token");
