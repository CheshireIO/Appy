const express = require('express');

const bodyParser = require('body-parser');
const axios = require('axios');
const { Configuration, OpenAIApi } = require("openai");
const cors = require('cors');
const MONDAY_API_URL = 'https://api.monday.com/v2';
const app = express();
app.use(cors());

app.use(express.json());
app.use(express.static('public'));

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);




app.post('/api/chat', async (req, res) => {
  const message = req.body.prompt;
  const conversationHistory = req.body.history;
  
  let newAns = {
    role: 'user',
    content: message
  };
  conversationHistory.push(newAns);

  const gptResponse = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: conversationHistory,
    max_tokens: 2000
  });

  res.setHeader('Access-Control-Allow-Origin', '*'); // Set the CORS header
  let reply = gptResponse.data.choices[0].message.content.trim();
  let newRes = {
    role: "assistant",
    content: reply
  };
  conversationHistory.push(newRes);
  res.send({reply, conversationHistory});
});


app.get('/:id', async (req, res) => {
  console.log("in id route")
  res.sendFile(__dirname + '/public/index.html');
});



app.get('/api/username/:id', async (req, res) => {
  const id = req.params.id;
  console.log("The ID in route" + id);
  const mondayQuery = `
    {
      items_by_column_values(board_id: ${process.env.MONDAY_BOARD_ID}, column_id: "text4", column_value: "${id}") {
        name
      }
    }
  `;

  const mondayResponse = await axios.post(MONDAY_API_URL, {
    query: mondayQuery
  }, {
    headers: {
      'Authorization': process.env.MONDAY_API_KEY,
      'Content-Type': 'application/json'
    }
  });

  const result = mondayResponse.data.data.items_by_column_values[0];
  const userName = result.name;
  console.log(userName + "Username is");
  res.send({ userName: userName });
});


app.listen(3000, () => {
  console.log('Server started on port 3000');
});
