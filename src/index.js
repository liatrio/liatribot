/*
 *
 * index.js
 *
 * 04.24.2018
 *
*/

// Leave this in for block-scoped declaration support
'use strict';

// Include the serverless-slack bot framework
const slack = require('serverless-slack');
const db = require('./db');

// The function that AWS Lambda will call
exports.handler = slack.handler.bind(slack);


// Slash Command handler
slack.on('/greet', (msg, bot) => {
  let message = {
    text: "How would you like to greet the channel?",
    attachments: [{
      fallback: 'actions',
      callback_id: "greetings_click",
      actions: [
        { type: "button", name: "Wave", text: ":wave:", value: ":wave:" },
        { type: "button", name: "Hello", text: "Hello", value: "Hello" },
        { type: "button", name: "Howdy", text: "Howdy", value: "Howdy" },
        { type: "button", name: "Hiya", text: "Hiya", value: "Hiya" }
      ]
    }]
  };

  // ephemeral reply
  bot.reply(message); 
});


// Interactive Message handler
slack.on('greetings_click', (msg, bot) => {
  let message = { 
    // selected button value
    text: msg.actions[0].value 
  };  

  // public reply
  bot.reply(message);
});


// Reaction Added event handler
slack.on('reaction_added', (msg, bot) => {
  bot.reply({ 
    text: ':wave:' 
  });
});

slack.on('/beerjar', (msg, bot) => {
  if (msg.text === '') {
    // no msg text, need a subcommand
    bot.reply({text:'Please specify an argument. \`/beerjar help\`'});
  } else if (msg.text.includes(' ') || msg.text.includes('\n')) {
    // there was a space so there must be more than one arg
    bot.reply({text:'Please specify just one argument. \`beerjar help\`'});
  } else {
    // If the first character is @, slice it off
    msg.text = (msg.text[0] === '@') ? msg.text.slice(1) : msg.text;

    if (msg.text === 'list') {
      bot.reply({text: "listing all beerjars..."});
    } else if (msg.text === 'help') {
      bot.reply({text: `\`/beerjar <name>\`: Add $1 to a beerjar\n\`/beerjar list\`: List all beerjar totals\n\`/beerjar create <name>\`: Create a beerjar\n\`/beerjar help\`: display this help message`});
    } else {
      let itemToSave = {
        id: `${msg.text}`,
        beerjar: 1
      }
      console.log('saving...');
      db.save(itemToSave).then( (res) => {
        bot.reply({text: `$1 was added to ${msg.text}'s beerjar! :beer:`});
        console.log('res:' + res);
      }).catch( (err) => {
        bot.reply({text: `${msg.text} doesn't have a beerjar. \`/beerjar help\``);
        console.log('err:' + err);
      });
    }
  }
});

