import ChatDialog from '@/components/ChatDialog';
import ThemeToggle from '@/components/ThemeToggle'
import { CHATBOT_NAME, INITIAL_CONVERSATION, ROLE_TPYE, USER_NAME } from '@/constants';
import type { ChatCompletionRequestMessage } from 'openai';
import React, { ChangeEvent, Fragment, KeyboardEvent, useCallback, useRef, useState } from 'react'

export default function Home() {
  const [inputValue, setInputVaule] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const conversationListRef = useRef<ChatCompletionRequestMessage[]>(INITIAL_CONVERSATION);
  const handleInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setInputVaule(e.target.value)
    },
    [],
  )
  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => { 
      
      if (e.key === "Enter") {
        const chatHistory = [...conversationListRef.current, {role: "user", content: inputValue}]
        conversationListRef.current = [...conversationListRef.current, {role: "user", content: inputValue}];
        const response = await fetch("/api/openAIChat", {
          method: "POST",
          headers: {
                "Content-Type": "application/json",
            },
          body: JSON.stringify({ message: chatHistory}),
        })

        const data = await response.json()
        setInputVaule("")
        conversationListRef.current = [...conversationListRef.current, {role: "assistant", content: data.result}];
      }
  }
  const handleRefresh = () => {
    conversationListRef.current = [];
    console.log('conversationListRef', conversationListRef);
    inputRef.current?.focus();
    setInputVaule("");
    
  }


   return( <div className='w-full'>
      <div className='flex flex-col items-end justify-center pt-20 pr-20 text-center'>
      <ThemeToggle />
      </div>
      <div className='flex flex-col items-center justify-center pt-20 text-center'>
        
        <h1 className='text-600'>{CHATBOT_NAME}</h1>
        <div className='my-12'>
     
        <p className='mb-6 font-bold'>Please type your prompt to chat with me</p>
        <input
           placeholder='Input here'
           className= 'w-full max-w-xs input input-bordered input-secondary'
           value={inputValue}
           onChange={handleInput}
           onKeyDown={handleKeyDown}
           ref={inputRef}
           />
          <button className="btn btn-primary mt-5 mb-5" onClick={handleRefresh}>new converation</button>
      </div>
    </div>
    <div className="textarea">
       {conversationListRef.current.map((item, index) => ( <Fragment key={index}>
       <ChatDialog item = {item}></ChatDialog>
       </Fragment>))}
    </div>
  </div>
  )
}