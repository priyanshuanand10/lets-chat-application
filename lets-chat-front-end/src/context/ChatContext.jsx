import { createContext, useContext, useState } from "react";

const ChatContext = createContext()

export const ChatProvider = ({ children }) => {

    const [currUser, setCurrUser] = useState("")
    const [roomId, setRoomId] = useState("")
    const [connected, setConnected] = useState(false)

    return <ChatContext.Provider value={{ currUser, roomId, connected, setCurrUser, setRoomId, setConnected }}>{children}</ChatContext.Provider>
}
const useChatContext =()=>useContext(ChatContext);
export default useChatContext;