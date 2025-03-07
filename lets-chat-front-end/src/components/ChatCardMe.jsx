import React from 'react';

const ChatCardMe = ({ sender, message, time }) => {
  return (
    <div className="flex justify-start mb-4">
      <div className="bg-lime-900 p-3 rounded-xl shadow-md w-full max-w-lg">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-bold text-yellow-300">{sender}</h4>
          <span className="text-gray-400 text-sm">{time}</span>
        </div>
        <p className="text-white-600">{message}</p>
      </div>
      <div className="flex-shrink-0 ml-3">
        <div className="bg-gray-600 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold">
        {sender.split(' ').map(w=>w.charAt(0).toUpperCase()).join('')}
        </div>
      </div>
    </div>
  );
};

export default ChatCardMe;