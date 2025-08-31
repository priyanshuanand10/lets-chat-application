import { Button } from '@material-tailwind/react';
import React, { useEffect, useRef, useState } from 'react';
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
import axios from 'axios';

export default function ChatRoom() {
    const { currUser, roomId, connected } = useChatContext();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const stompClientRef = useRef(null);
    const endOfMessagesRef = useRef(null);

    useEffect(() => {
        if (!connected) navigate("/");
    }, [currUser, roomId, connected, navigate]);

    useEffect(() => {
        const loadMsg = async () => {
            try {
                const response = await getMessageApi(roomId);
                setMessages(response);
            } catch (error) {
                toast.error(error?.response?.data?.message || "Failed to load messages");
            }
        };
        loadMsg();
    }, [roomId]);

    useEffect(() => {
        const connWebSocket = async () => {
            const sockJs = new SockJS(`${baseUrl}/chat`);
            const client = Stomp.over(sockJs);
            await client.connect({
                "headers": {
                    Authorization: 'Basic ' + btoa('priyam:priyam')
                }
            }, () => {
                stompClientRef.current = client;
                toast.success(`Connected to ${roomId}`);
                client.subscribe(`/topic/room/${roomId}`, (message) => {
                    const newMsg = JSON.parse(message.body);
                    // Debug: log received message
                    console.log('Received message:', newMsg.body);
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

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const sendMsg = async () => {
        if (
            !connected ||
            !stompClientRef.current ||
            !stompClientRef.current.connected
        ) {
            toast.error("WebSocket not connected. Please wait and try again!");
            return;
        }
        if (!input.trim() && !selectedFile) {
            toast('please enter some text or attach a file!', { icon: '⚠️' });
            return;
        }

        let fileId = '';
        let fileName = '';
        if (selectedFile) {
            setUploading(true);
            const formData = new FormData();
            formData.append('file', selectedFile);
            try {
                const res = await axios.post(
                    'http://localhost:8080/attachments/upload',
                    formData,
                    {
                        headers: {
                            'Authorization': 'Basic ' + btoa('priyam:priyam'),
                        },
                    }
                );
                fileId = res.data.id;
                fileName = selectedFile.name;
            } catch (err) {
                toast.error('File upload failed');
                setUploading(false);
                return;
            }
            setUploading(false);
        }

        const now = moment().format('DD-MM-YYYY hh:mm:ss A');
        const messagenew = {
            id: null,
            sentBy: currUser,
            message: input,
            msgTime: now,
            fileName,
            fileId,
        };

        // Log the sent message
        console.log('Sent message:', messagenew);

        stompClientRef.current.send(`/app/add-message/${roomId}`, {}, JSON.stringify(messagenew));
        setInput("");
        setSelectedFile(null);
    };

    const handleDownload = (id, name) => {
        fetch(`http://localhost:8080/attachments/${id}/download`, {
            method: 'GET',
            headers: {
                'Authorization': 'Basic ' + btoa('priyam:priyam'),
            }
        })
            .then(response => response.blob())
            .then(blob => {
                const downloadUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = name || '';
                document.body.appendChild(a);
                a.click();
                a.remove();
            })
            .catch(() => toast.error('Download failed'));
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
                                    <ChatCardMe
                                        sender={msg.sentBy}
                                        message={msg.message}
                                        time={msg.msgTime}
                                        fileName={msg.fileName}
                                        fileId={msg.fileId}
                                        onDownload={() => handleDownload(msg.fileId, msg.fileName)}
                                    /> :
                                    <ChatCard
                                        sender={msg.sentBy}
                                        message={msg.message}
                                        time={msg.msgTime}
                                        fileName={msg.fileName}
                                        fileId={msg.fileId}
                                        onDownload={() => handleDownload(msg.fileId, msg.fileName)}
                                    />
                                }
                            </div>
                        ))}
                        <div ref={endOfMessagesRef} />
                    </div>
                </main>
            </div>
            <footer className='bottom-0 fixed w-[100%] p-[2%] flex flex-col items-center bg-black border-t border-gray-300'>
                {selectedFile && (
                    <div className="mb-2 text-gray-200">
                        Attached: {selectedFile.name}
                        {uploading && <span> (Uploading...)</span>}
                    </div>
                )}
                <div className="flex w-full items-center bg-gray-900 rounded-full px-3 py-2 shadow border border-gray-700">
                    <label className="mr-2 flex items-center cursor-pointer">
                        <input
                            type="file"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                            disabled={uploading}
                        />
                        <MdAttachment className="size-7 text-white hover:text-blue-400" />
                    </label>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type Your Message Here..."
                        className="border-none p-3 rounded-full w-full bg-transparent text-white focus:outline-none"
                        disabled={uploading}
                    />
                    <Button className="bg-blue-600 ml-2 rounded-full px-4 py-2 text-white" onClick={sendMsg} disabled={uploading || (!input.trim() && !selectedFile)}>
                        <MdSend className='size-7' />
                    </Button>
                </div>
            </footer>
        </div>
    );
}
