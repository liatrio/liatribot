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
  let message = {
    text: `${JSON.stringify(msg, null, 4)}`,
    attachments: [{
      fallback: 'actions',
      callback_id: "reaction_added",
      actions: [
        { type: "button", name: "Wave", text: ":wave:", value: ":wave:" },
        { type: "button", name: "Hello", text: "Hello", value: "Hello" },
        { type: "button", name: "Howdy", text: "Howdy", value: "Howdy" },
        { type: "button", name: "Hiya", text: "Hiya", value: "Hiya" }
      ]
    }]
  };
  
  if (msg.text === '') {
    bot.reply({text:'no target specified -> BEERJAR HELP'});
  } else if (msg.text.includes(' ') || msg.text.includes('\n')) {
    // there was a space so there must be more than one arg
    bot.reply({text:'too many targets -> BEERJAR HELP'});
  } else {
    // If the first character is @, slice it off
    msg.text = (msg.text[0] === '@') ? msg.text.slice(1) : msg.text;

    let result = '';

    slack.store.get(msg.text).then(record => {
      if !(record.id) {
        result = 'failed to get item, creating new record...
        slack.store.save({id: msg.text, beerjar: 0});
      } else {
        result = JSON.stringiy(record, null, 4);
      }
    });
    //let message = { text: `beerjar ${msg.text}!` };
    //let result = JSON.stringify(slack.store.get(msg.text), null, 4);
    let message = { text: `result: ${result}`};
    bot.reply(message); 
  }
});


