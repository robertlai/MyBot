# MyBot

This is MyBot. A silly bot I made a while ago that remembers users' messages that begin with "my". We have fun with this because users unknowingly record messages, and MyBot occasionally pops up and surprises us.

## Usage

Add MyBot to a Discord guild using the OAuth2 link.
https://discord.com/api/oauth2/authorize?client_id=621207039053529098&permissions=67584&scope=bot

Configure aliases for users using the `alias` command.
```
alias <ALIAS> <USERID>
```
For now, users can only configure their own alias.

When a user sends a message that begins with the word "my", MyBot will record the message text in a (poorly implemented) trie.
The messages can be retrieved by sending a message that shares a prefix with the recorded message. The message can also be retrieved by other users by replacing "my" with the user's alias in possessive form.

Example
```
Little:     alias little 000000000000000000
Little:     my bot is so cool.
Little:     my bot
MyBot:      is so cool.
Doormat:    little's bot
MyBot       is so cool.
Little:     my bot is so
MyBot:      cool.
```

## Running your own instance

To run your own instance of MyBot, clone the repository and run
```
npm install && npm run build && npm start
```
