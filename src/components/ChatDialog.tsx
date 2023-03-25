import { ChatCompletionRequestMessage } from "openai";
import React from "react";
import { CHATBOT_NAME, USER_NAME } from "../constants";
type ChatDialogProp = {
    item: ChatCompletionRequestMessage
}
 const ChatDialog: React.FC<ChatDialogProp> = ({ item }: ChatDialogProp) => {
    return (
    <>

     {item.role === "assistant" ? (
      <div className='chat chat-end mb-5'>
          <div className='chat-bubble chat-bubble-secondary'>
              <strong className='badge badge primary mb-1'>{CHATBOT_NAME}</strong>
              <br />
              {item.content}
          </div>
        </div>) : 
            (<div className='chat chat-start mb-5'>
            <div className='chat-bubble chat-bubble-primary'>
                <strong className='badge badge primary mb-1'>{USER_NAME}</strong>
                <br />
                {item.content}
            </div>
        </div>)
      }
    </>
    );
  }

  export default ChatDialog