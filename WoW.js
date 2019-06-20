const Discord = require("discord.js");
const client = new Discord.Client();
const class_ =  require('./class_.json');
let classes = class_["class_"];
const fs = require('fs');

console.log(classes['warrior'])
client.on("ready",()=>{
    console.log(`${client.user.username} is now online!!`);
    client.guilds.get("561403936276217866").channels.get("571080855544659991").send("** **");
});

client.on("guildMemberUpdate", (oldMember,newMember)=>{
    if(newMember.guild.id !== "561403936276217866" || newMember.roles === oldMember.roles) return;
    let member = newMember;
    let dps ;
    let healer;
    let tank;
    let message = [];
    message.push(`**### Current Raid Roster - ${member.guild.members.filter(m=>m.roles.find(r=>Object.keys(classes).includes(r.name.toLowerCase())) && m.roles.has('575846415897460747')).size} ###**`);

    member.guild.roles.filter(r=>Object.keys(classes).includes(r.name.toLowerCase())).forEach(r=>{

        let members = member.guild.members.filter(m=>m.roles.has(r.id)&& m.roles.has('575846415897460747'));
        message.push(`\n**${r.name} - ${members.size}**`);
        
        if(members.size > 0){
            dps = members.map(m=>{if(m.roles.has('590759408984784907')) return m.user.username}).filter(m=>m);
            healer = members.map(m=>{if(m.roles.has('590759431554465827')) return m.user.username}).filter(m=>m);
            tank = members.map(m=>{if(m.roles.has('590759452194373652')) return m.user.username}).filter(m=>m);

            if(dps.length && classes[r.name.toLowerCase()].includes('dps')){
                message.push("**DPS:** "+dps.join(' '));
            }
            if(healer.length && classes[r.name.toLowerCase()].includes('healer')){
                message.push("**Healer:** "+healer.join(' '));
            }
            if(tank.length && classes[r.name.toLowerCase()].includes('tank')){
                message.push("**Tank:** "+tank.join(' '));
            }  
               
        }
    });

    let embed = new Discord.RichEmbed()
        .setDescription(message.join('\n'))
        .setColor('RANDOM');
    member.guild.me.lastMessage.edit(embed);
    
});

client.on("message",message=>{
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    if(message.channel.type === "dm")   return;

    if(cmd !== "~addClass" && cmd !== "~removeClass")   return;
    if(!message.member.hasPermission('ADMINISTRATOR'))  return message.channel.send('Only administrators can use this command.');

    console.log(args)
    
    if(cmd === '~addClass'){
        if(args.length !== 2)   return  message.channel.send("You need **two** parameters!! (class name, attributes<-separate by a comma)");

        if(args[1].split(',').filter(arg=>arg.toLowerCase() !== 'dps' && arg.toLowerCase() !== 'healer' && arg.toLowerCase() !== 'tank').length > 0)    return message.channel.send("Invalid attribute provided. Command cancelled.");

        
        class_["class_"][args[0].toLowerCase()] = args[1].toLowerCase();
        message.channel.send('Class has been added');
    }else{
        if(args.length === 0)   return  message.channel.send("You haven't stated any class!!");

        delete class_["class_"][args[0].toLowerCase()];

        message.channel.send("Class removed!")
    }

    fs.writeFile('class_.json',JSON.stringify(class_),(err)=>{
        if(err) return console.error(err.message);
    });
});
client.login("");

