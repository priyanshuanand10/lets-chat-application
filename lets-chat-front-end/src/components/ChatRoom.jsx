import { Button, Input } from '@material-tailwind/react';
import React, { useEffect, useRef, useState } from 'react';
import Logout from "/logo/logout.png";
import { MdAttachment, MdSend } from 'react-icons/md';
import ChatCard from './ChatCard';
import ChatCardMe from './ChatCardMe';
import { useNavigate } from 'react-router';
import useChatContext from '../context/ChatContext';
import toast from 'react-hot-toast';
import SockJS from 'sockjs-client';
import { baseUrl } from '../configs/AxiosHelper';
import { Stomp } from '@stomp/stompjs';
import moment from 'moment';
import { getMessageApi } from '../services/RoomService';

export default function ChatRoom() {
    const { currUser, roomId, connected, setCurrUser, setRoomId, setConnected } = useChatContext();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const inputRef = useRef(null);
    const chatBotref = useRef(null);
    const [stompClient, setStompClient] = useState(null);
    const endOfMessagesRef = useRef(null);

    useEffect(() => {
        if (!connected) {
            navigate("/");
        }
    }, [currUser, roomId, connected]);

    useEffect(() => {
        const loadMsg = async () => {
            try {
                const response = await getMessageApi(roomId);
                setMessages(response);
            } catch (error) {
                console.log(error);
                toast.error(error.response.data.message);
            }
        };
        loadMsg();
    }, []);

    useEffect(() => {
        const connWebSocket = async () => {
            const sockJs = new SockJS(`${baseUrl}/chat`);
            const client = Stomp.over(sockJs);
            await client.connect({
              "headers":{
                  Authorization: 'Basic cHJpeWFtOnByaXlhbQ=='
              }
            }, () => {
                setStompClient(client);
                toast.success(`Connected to ${roomId}`);
                client.subscribe(`/topic/room/${roomId}`, (message) => {
                    const newMsg = JSON.parse(message.body);
                    setMessages((prev) => [...prev, newMsg.body]);
                });
            });
        };
        connWebSocket();
    }, [roomId]);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const exitRoom = () => {
        toast.success("Logged out successfully!!!");
        navigate("/");
    };

    const sendMsg = async () => {
        if (connected && stompClient && input.trim()) {
            const now = moment().format('DD-MM-YYYY hh:mm:ss A');
            const messagenew = {
                id: null,
                sentBy: currUser,
                message: input,
                msgTime: now,
            };

            stompClient.send(`/app/add-message/${roomId}`, {}, JSON.stringify(messagenew));
            setInput("");
        } 
        else if (connected && stompClient && input.length==0) {
         
            toast('please enter some text!', {
                icon: '⚠️',
              });
        
        } 
        
        else {
            toast.error("Something went wrong, please try again later!!!");
            exitRoom();
        }
    };

    return (
        <div className='h-full flex flex-col'>
            <header className='fixed w-full flex justify-around bg-gray-700 py-1.5'>
                <div>Hi, {currUser}</div>
                <div className='font-bold'>{roomId}</div>
                <div>
                    <Button className="bg-red-500 px-2 py-1.5 rounded-4xl" onClick={exitRoom}>
                        Exit
                    </Button>
                </div>
            </header>
            <div className="p-5 flex-grow flex flex-col items-center justify-center">
                <main className="flex items-center justify-center w-full" style={{ height: 'calc(100vh - 6rem)' }}>
                    <div className="p-8 text-white rounded shadow-md h-full w-full max-w-lg overflow-auto">
                        {messages.map((msg, index) => (
                            <div key={index}>
                                {currUser === msg.sentBy ? 
                                    <ChatCardMe sender={msg.sentBy} message={msg.message} time={msg.msgTime} /> : 
                                    <ChatCard sender={msg.sentBy} message={msg.message} time={msg.msgTime} />
                                }
                            </div>
                        ))}
                        <div ref={endOfMessagesRef} />
                    </div>
                </main>
            </div>
            <footer className='bottom-0 fixed w-[100%] p-[2%] flex justify-center'>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => { setInput(e.target.value); }}
                    placeholder="Type Your Message Here..."
                    className="border border-gray-300 p-3 rounded-full w-full"
                />
                <Button className="bg-gray-1000 m-auto" onClick={sendMsg}>
                    <MdSend className='size-7' />
                </Button>
            </footer>
        </div>
    );
}
