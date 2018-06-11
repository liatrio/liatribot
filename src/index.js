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

slack.on('/gift', (msg, bot) => {
	if (msg.text === '') {
		// no msg text, need a subcommand
		bot.replyPrivate({text:'Please specify an argument. \`/gift help\`'});
	} else if (msg.text.includes(' ') || msg.text.includes('\n')) {
		// there was a space so there must be more than one arg
		bot.replyPrivate({text:'Please specify just one argument. \`/gift help\`'});
	} else {
		// If the first character is @, slice it off
		msg.text = msg.text.toLowerCase();
		msg.text = (msg.text[0] === '@') ? msg.text.slice(1) : msg.text;

		if (msg.text === 'help') {
			bot.replyPrivate({text: `\`/gift <name>\`\t\t\tReward someone for being awesome\n\`/gift help\`\t\t\t\tDisplay this help message`});
		} else {
      db.getItem(msg.text).then( (res) => {
        if (Object.keys(res).length === 0) {
          bot.replyPrivate({text: `There is no user by the name of ${msg.text}. \`/adduser help\``});
        } else {
				  let newTotal = 1;
				  if (res.Item.giftjar) {
            newTotal = res.Item.giftjar + 1;
			  	}
          let data = {
            id: msg.text,
            giftjar: newTotal
          }
          db.save(data).then( (res) => {
            bot.reply({text: `$1 was added to ${msg.text}'s giftjar by ${msg.user_name}!`});
            console.log('res:' + res);
          }).catch( (err) => {
            console.log('err:' + err);
          });
        }
      }).catch( (err) => {
        console.log('err:' + err);
      });
    }
	}
});

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

slack.on('/beergift', (msg, bot) => {
	if (msg.text === '') {
		// no msg text, need a subcommand
		bot.replyPrivate({text:'Please specify an argument. \`/beergift help\`'});
	} else if (msg.text.includes(' ') || msg.text.includes('\n')) {
		// there was a space so there must be more than one arg
		bot.replyPrivate({text:'Please specify just one argument. \`/beergift help\`'});
	} else {
		// If the first character is @, slice it off
		msg.text = msg.text.toLowerCase();
		msg.text = (msg.text[0] === '@') ? msg.text.slice(1) : msg.text;

		if (msg.text === 'help') {
			bot.replyPrivate({text: `\`/beergift <name>\`\t\t\tSubtract $1 from a beerjar\n\`/beergift help\`\t\t\t\tDisplay this help message`});
		} else {
      db.getItem(msg.text).then( (res) => {
        if (Object.keys(res).length === 0) {
          bot.replyPrivate({text: `There is no user by the name of ${msg.text}. \`/adduser help\``});
        } else {
          let newTotal = res.Item.beerjar - 1;
          if (newTotal < 0) {
            newTotal = 0;
          }
          let data = {
            id: msg.text,
            beerjar: newTotal
          }
          db.save(data).then( (res) => {
            bot.reply({text: `:beer: $1 was subtracted from ${msg.text}'s beerjar by ${msg.user_name}! :beer:`});
            console.log('res:' + res);
          }).catch( (err) => {
            console.log('err:' + err);
          });
        }
      }).catch( (err) => {
        console.log('err:' + err);
      });
    }
	}
});


slack.on('/beerjar', (msg, bot) => {
	if (msg.text === '') {
		// no msg text, need a subcommand
		bot.replyPrivate({text:'Please specify an argument. \`/beerjar help\`'});
	} else if (msg.text.includes(' ') || msg.text.includes('\n')) {
		// there was a space so there must be more than one arg
		bot.replyPrivate({text:'Please specify just one argument. \`/beerjar help\`'});
	} else {
		// If the first character is @, slice it off
		msg.text = msg.text.toLowerCase();
		msg.text = (msg.text[0] === '@') ? msg.text.slice(1) : msg.text;

    if (msg.text === 'balance') {
		} else if (msg.text === 'list') {
			let attributes = [ 'id', 'beerjar' ];
			db.scan(attributes).then( (res) => {
				// Sort by Beerjar totals in descending order
				// https://www.w3schools.com/jsref/jsref_sort.asp
				res.Items.sort( (a, b) => b.beerjar - a.beerjar );
				let text = ":beers: Beerjar Totals :beers:\n";
				res.Items.slice(0, 10).forEach( (value, index) => {
					index += 1
					text += `(${index})\t$${value.beerjar}\t${value.id}\n`
				});
				bot.reply({text});
				//bot.reply({text: JSON.stringify(res, null, 2)});
			}).catch( (err) => {
        bot.reply({err});
				console.log('err:' + err);
			});
		} else if (msg.text === 'help') {
			bot.replyPrivate({text: `\`/beerjar <name>\`\t\t\tAdd $1 to a beerjar\n\`/beerjar list\`\t\t\t\tList all beerjar totals\n\`/beerjar help\`\t\t\t\tDisplay this help message`});
		} else {
      db.getItem(msg.text).then( (res) => {
        if (Object.keys(res).length === 0) {
          bot.replyPrivate({text: `There is no user by the name of ${msg.text}. \`/adduser help\``});
        } else {
          let newTotal = res.Item.beerjar + 1;
          let data = {
            id: msg.text,
            beerjar: newTotal
          }
          db.save(data).then( (res) => {
            bot.reply({text: `:beer: $1 was added to ${msg.text}'s beerjar by ${msg.user_name}! :beer:`});
            console.log('res:' + res);
          }).catch( (err) => {
            console.log('err:' + err);
          });
        }
      }).catch( (err) => {
        console.log('err:' + err);
      });
    }
	}
});

slack.on('/adduser', (msg, bot) => {
	if (msg.text === '') {
		// no msg text, need a subcommand
		bot.replyPrivate({text:'Please specify an argument. \`/adduser help\`'});
	} else if (msg.text.includes(' ') || msg.text.includes('\n')) {
		// there was a space so there must be more than one arg
		bot.replyPrivate({text:'Please specify just one argument. \`/adduser help\`'});
	} else if (msg.text === 'help') {
		bot.replyPrivate({text: `\`/adduser <name>\`\t\t\tAdd a user to Liatribot\n\`/adduser help\`\t\t\t\tDisplay this help message`});
	} else {
		// If the first character is @, slice it off
		msg.text = msg.text.toLowerCase();
		msg.text = (msg.text[0] === '@') ? msg.text.slice(1) : msg.text;

		// check if user already exists... don't create if so
		/*
		 *
		 *
		 */

		// Create the information for the new user
		let data = {
			id: `${msg.text}`,
			beerjar: 0,
			giftjar: 0
		}

		// Save the new user
		db.save(data).then( (res) => {
			bot.replyPrivate({text: `${msg.text} is now able to participate in Liatribot features.`});
		}).catch( (err) => {
			console.log('err:' + err);
		});
	}
});

