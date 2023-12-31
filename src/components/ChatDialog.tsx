import { ChatCompletionRequestMessage } from "openai";
import React, { useState } from "react";
import { CHATBOT_NAME, USER_NAME } from "../constants";
type ChatDialogProp = {
    item: ChatCompletionRequestMessage
}
 const ChatDialog: React.FC<ChatDialogProp> = ({ item }: ChatDialogProp) => {

    const renderContent = (text: string ) => {
        return text.replaceAll('-', '\n').split(/\n/).map((line:string) => <React.Fragment key={line}>{line}<br/></React.Fragment>)
    }
    const [copied, setCopied] = useState("copy");
    return (
    <>

     {item.role === "assistant" ? (
      <div>
      <div className='flex flex-col  mb-5'>
            <div className='bg-secondary py-5 px-5'>
                <div className="flex flex-row justify-between items-center">
                    <strong className='badge badge primary mb-1'>{CHATBOT_NAME}</strong>
                    <button
              className={!item.content ? 'hidden': 'btn btn-primary ml-2 btn-sm flex-end'}
              onClick={() => {
                  navigator.clipboard.writeText(item.content || "");
                  setCopied("copied");
              }}>
              {copied}
          </button>
                </div>
                <br />
                <div className="text-neutral-50">{renderContent(item.content || "")}</div>
            
          </div>
        </div>
        </div>) : 
            (<div className='chat chat-start mb-5'>
            <div className='chat-bubble chat-bubble-primary'>
                <strong className='badge badge primary mb-1'>{USER_NAME}</strong>
                <br />
                    <div>{renderContent(item.content || "")}</div>
            </div>
        </div>)
      }
    </>
    );
  }

  export default ChatDialog