import React from 'react';

const ChatCard = ({ sender, message, time, fileName, fileId, onDownload }) => {
  return (
    <div className="flex justify-start mb-4">
      <div className="flex-shrink-0 mr-3">
        <div className="bg-gray-600 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold">
          {sender.split(' ').map(w => w.charAt(0).toUpperCase()).join('')}
        </div>
      </div>
      <div className="bg-green-900 p-3 rounded-xl shadow-md w-full max-w-lg">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-bold text-white-800">{sender}</h4>
          <span className="text-gray-400 text-sm">{time}</span>
        </div>
        <p className="text-white-600">{message}</p>
        {fileName && fileId && (
          <div className="mt-2">
            <a
              href="#"
              onClick={e => { e.preventDefault(); onDownload(fileId, fileName); }}
              className="text-blue-400 underline"
            >
              {fileName}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatCard;