import React, { useState } from 'react';
import axios from 'axios';

//A React component that manages a form for sending a POST request to a Node.js server
function ChatApp() {
    const [text, setText] = useState('');
    const [response, setResponse] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const apiUrl = 'http://localhost:3001/api/chat'; // The URL of our Node.js server
            const requestData = { text };

            const response = await axios.post(apiUrl, requestData);


            setResponse(response.data.message);
        } catch (error) {
            if (error.response) {
                // Handle HTTP response errors
                console.error('Erreur de réponse HTTP :', error.response.status);
                console.error('Données de réponse :', error.response.data);
            } else if (error.request) {
                // Handle query errors
                console.error('Erreur de requête :', error.request);
            } else {
                // Handle unexpected errors
                console.error('Erreur inattendue :', error.message);
            }
        }
    };

    return (
        <div>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Entrez votre texte"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <button type="submit" >Envoyer</button>
            </form>
            {response && (
                <div>
                    <p>Réponse :</p>
                    <p>{response}</p>
                </div>
            )}
        </div>
    );
}

export default ChatApp;
