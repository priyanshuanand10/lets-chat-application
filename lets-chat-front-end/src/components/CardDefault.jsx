import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Input,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";

import ChatIcon from "/logo/letschatlogo.png"
import toast from "react-hot-toast";
import { createRoomApi, joinRoomApi } from "../services/RoomService";
import { cache } from "react";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";

export function CardDefault() {


  const navigate = useNavigate();



  const {currUser, roomId, connected, setCurrUser, setRoomId, setConnected} = useChatContext();


  const [details, setDetails] = useState({
    "roomId": "",
    "createdBy": ""
  })


  const validateForm = () => {

    if (details.name === "" || details.roomId === "") {
      toast.error("please enter name and room-id")
      return false;
    } else {
      return true;
    }

  }

  const handleOnchange = (event) => {
    setDetails({
      ...details, [event.target.name]: event.target.value,
    })

  }

  async function joinRoom () {

    if (validateForm()) {

      try{

        const response = await joinRoomApi(details.roomId);
        console.log(response)
        if(response.httpStatus==200){
        
        setCurrUser(details.createdBy)
        setRoomId(response.data.roomId)
        setConnected(true)
        toast.success(`hi ${details.createdBy},room joined`)
        navigate("/chat-room")
        }
        else {
          toast.error(response.message)
        }
      }catch(error){
        toast.error(error.response.data.message)
      }
  
    } else {
      toast.error(error.response.data.message)
    }

  }

     async function createRoom  () {
    if (validateForm()) {
      try {
        const response = await createRoomApi(details);

        console.log(response)
        if (response.httpStatus >= 200 && response.httpStatus <= 205) {
          console.log(response.data)
          toast.success(`hi ${response.data.createdBy},room created`)
          
          setCurrUser(response.data.createdBy)
          setRoomId(response.data.roomId)
          setConnected(true)
          navigate("/chat-room")



        } else {
          toast.error(response.message)
        }
      } catch (error) {
        toast.error(error.response.data.message)
      }
    } else {
      console.log("not a valid form")
    }
  }
  return (
    //bg-gray-900
    <Card className="flex items-center justify-center bg-dark">
      <CardHeader color="blue-gray" className="relative">
        <img
          className="w-[80%] m-auto"
          src={ChatIcon}
          alt="card-image"
        />
      </CardHeader>
      <CardBody>
        <Input color="white" className="rounded-full focus-within:bg-gray-700 " label="Enter your Name" onChange={handleOnchange} name="createdBy" value={details.name} />
        <br />
        <Input color="white" className="rounded-full  focus-within:bg-gray-700" label="Enter Room-Id" onChange={handleOnchange} name="roomId" value={details.roomId} />
      </CardBody>
      <CardFooter className="pt-0 mt-2">
        <Button className="bg-green-700 text-white font-bold py-2 px-4 rounded-full m-2 hover:bg-green-900" onClick={createRoom}>Create Room</Button>
        <Button className="bg-orange-500 text-white font-bold py-2 px-4 rounded-full m-2 hover:bg-orange-800" onClick={joinRoom}>Join Room</Button>
      </CardFooter>
    </Card>

  );
}