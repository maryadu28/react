/*--------------------------------------------------------
                    import modules
---------------------------------------------------------*/

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const util = require('util');
const dotenv = require('dotenv');
dotenv.config();
const port = 3001;

// a middleware to parse JSON data sent with HTTP requests
app.use(bodyParser.json());

//a middleware to manage HTTP requests coming from different domains
app.use(cors());

//POST request to the OpenAI API with the text received as parameter
app.post('/api/chat', async (req, res) => {
    try {
        const { text } = req.body;
        console.log('Corps de la requête JSON reçu :', text);
        const apiKey = process.env.OPENAI_API_KEY;
        const openaiUrl = 'https://api.openai.com/v1/completions';
        const openaiHeaders = {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        };
        const response = await fetch('https://api.openai.com/v1/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo-instruct',
                prompt: text,
                max_tokens: 250,
                temperature: 0.7,
            }),
        });

        if (response.status === 200) {
            const responseData = await response.json();
            const aiResponse = responseData.choices[0].text;
            console.log('Texte généré :', aiResponse);
            res.json({ message: aiResponse });//Return response to React browser
        } else {
            const errorText = await response.text();
            console.error(`Erreur lors de la requête à l'API d'OpenAI : ${response.status} ${response.statusText}`);
            console.error('Détails de l\'erreur :', errorText);
            res.status(500).json({ error: 'Erreur lors de la requête à l\'API d\'OpenAI' });
        }
    } catch (error) {
        if (error instanceof fetch.Response && error.status === 429) {
            await util.promisify(setTimeout)(5000);// Retry the request after a certain delay
            return app.post('/api/chat', req, res); // call the current function again to retry the request
        } else {
            console.error('Erreur inattendue :', error);
            res.status(500).json({ error: 'Erreur inattendue' });
        }
    }
});

app.listen(port, () => {
    console.log(`Le serveur est en écoute sur le port ${port}`);
});












