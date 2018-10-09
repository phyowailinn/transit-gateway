// index.js
// where your node app starts

// init project
// configation file declare 
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const url = require('url');
const requestPromise = require('request-promise');
const chatfuelBroadcast = require('chatfuel-broadcast').default;
const app = express();
const fs = require('fs');

// jons data define
const json_data = require(process.env.JSON_PATH);
// Parse data from application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/broadcast-to-chatfuel', (request, response) => {
  const botId = process.env.CHATFUEL_BOT_ID;
  const chatfuelToken = process.env.CHATFUEL_TOKEN;
  
  // Get user id and block name from request.body
  const {userId, blockName, messageAttr} = request.body;
  for (var i = 0; i < json_data.length; i++) {    
    const broadcastApiUrl = `https://api.chatfuel.com/bots/${botId}/users/${userId}/send`;
    // message attr mush be declared from chatfuel panel
    const query = Object.assign({
        chatfuel_token: chatfuelToken,
        chatfuel_block_name: 'ShowWebView',
        message: messageAttr
      },
      request.body
    );
    
    const chatfuelApiUrl = url.format({
      pathname: broadcastApiUrl,
      query
    });
    
    const options = {
      uri: chatfuelApiUrl,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    requestPromise.post(options);
  }

  response.json({'message':'Successfully sending'});
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
