import React, { useEffect, useState, useRef } from 'react'
import ChatHeader from './ChatHeader'
import Message from './Message'
import './Chat.css'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import CardGiftcardIcon from '@material-ui/icons/CardGiftcard'
import GifIcon from '@material-ui/icons/Gif'
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions'
import { selectUser } from './features/userSlice'
import { useSelector } from 'react-redux'
import { selectChannelId, selectChannelName } from './features/appSlice'
import db from './firebase'
import firebase from 'firebase'

const Chat = () => {
    const user = useSelector(selectUser);
    const channelId = useSelector(selectChannelId);
    const channelName = useSelector(selectChannelName);

    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);

    const messagesRef = useRef(null);

    useEffect(() => {
        if(channelId){
            db.collection('channels').doc(channelId).collection('messages').
            orderBy('timestamp', 'asc').onSnapshot(snapshot=> {
                setMessages(snapshot.docs.map((doc) => doc.data()))
            });
        }
    }, [channelId])

    useEffect(() => {
            messagesRef.current?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
      }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();

        db.collection('channels').doc(channelId).collection('messages').
        add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            user: user,

        });

        setInput("");
    };

    return (
        <div className="chat">
            <ChatHeader channelName={channelName}/>

            <div className="chat__messages">
                {messages.map(message => (
                    <Message 
                        timestamp={message.timestamp}
                        message={message.message}
                        user={message.user}
                    />
                ))}
                <div ref={messagesRef}></div>
            </div>

            <div className="chat__input">
                <AddCircleIcon fontSize="large" />
                <form>
                    <input 
                        value={input}
                        disabled={!channelId}
                        onChange={e=> setInput(e.target.value)}
                        placeholder={`type message... #${channelName}`}
                    />
                    <button 
                        disabled={!channelId}
                        className="chat__inputButton"
                        type="submit"
                        onClick={sendMessage}
                    >
                    Send Message
                    </button>
                </form>

                <div className="chat__inputIcons">
                    <CardGiftcardIcon fontSize="large" />
                    <GifIcon fontSize="large" />
                    <EmojiEmotionsIcon fontSize="large" />
                </div>

            </div>
        </div>
    )
}

export default Chat
