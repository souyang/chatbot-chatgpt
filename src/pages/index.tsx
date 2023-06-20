import ChatDialog from '@/components/ChatDialog';
import ThemeToggle from '@/components/ThemeToggle'
import { CHATBOT_NAME } from '@/constants';
import type { ChatCompletionRequestMessage } from 'openai';
import React, { ChangeEvent, Fragment, useCallback, useRef, useState } from 'react'
import roles from "@/data/roleContext.json"
import CopyToClipboard from '@/components/CopyToClipboard';

export default function Home() {
  const [inputValue, setInputVaule] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const roleRef = useRef<HTMLSelectElement>(null);
  const [currentRole, setCurrentRole] = useState("");
  const [roleContext, setRoleContext] = useState("");
  const [conversationList, setConverstationList] = useState<ChatCompletionRequestMessage[]>([]);
  const [hintDialog, setHintDialog] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [copyText, setCopyText] = useState("copy");
  const [errorMessage, setErrorMessage] = useState("");
  const [isFirstConveration, setIsFirstConversation] = useState(false)
  const handleInput = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setInputVaule(e.target.value)
    },
    [],
  )
  const resetUserMessage = () => {
    inputRef.current?.focus();
    setInputVaule("");
  }
  const handleRoleSelect = useCallback(
     (e: ChangeEvent<HTMLSelectElement>) => {
     setCurrentRole(e.target.value)
     setConverstationList([]);
     setInputVaule('');
     setIsFirstConversation(true)
     inputRef.current?.focus()
     const context = roles.find((role) => {return role.id === e.target.value})?.context || ""
     const hintDialog = roles.find((role) => {return role.id === e.target.value})?.hintDialog || ""
     setRoleContext(context)
     setHintDialog(hintDialog)
     setCopyText("copy")
     setIsFirstConversation(true)
     //setConverstationList([{role: "user", content: context}])
    },
    [],
  )
  const generateReply = async () => { 
        let chatHistory: ChatCompletionRequestMessage[] = [...conversationList, {role: "user", content: isFirstConveration ? roleContext + ' ' + inputValue : inputValue}]
        //console.log('chatHistory', chatHistory);
        setShowLoader(true);
        try {
        const response = await fetch("/api/openAIChat", {
          method: "POST",
          headers: {
                "Content-Type": "application/json",
            },
          body: JSON.stringify({ message: chatHistory}),
        })
        setShowLoader(false);
        if (response.status === 200) {
          setErrorMessage("")
          setIsFirstConversation(false);
          const data = await response.json()
          //setInputVaule("")
          chatHistory = [{role: "user", content: inputValue}, ...chatHistory.slice(1)]
          setConverstationList([...chatHistory, {role: "assistant", content: data.result}]);
        } else {
          if (typeof response === 'string') {
            setErrorMessage(response);
          } else {
          const data = await response.json();
          console.log('data', data);
          setErrorMessage(data.result);
          }
        }
      }
      catch(error) {
        if (error instanceof Error) {
        console.error('data', error.message);
        setErrorMessage(error.message);
        } else {
          setErrorMessage('error occured');
        }
      }
  }
  const handleRefresh = () => {
    setConverstationList([])
    setIsFirstConversation(true)
    inputRef.current?.focus()
    setInputVaule("")
    setCurrentRole("")
  }

  const resetConverationwithExistingRole = () => {
    inputRef.current?.focus()
    setInputVaule("")
    setIsFirstConversation(true)
    setConverstationList([{role: "user", content: roleContext}])
  }

  const handleCopyText = () => {
    setCopyText("copied");
  }


   return( <div className='w-full'>
      <div className='flex flex-col items-end justify-center pt-20 pr-20 text-center'>
      <ThemeToggle />
      </div>
      <div className='flex flex-col items-center justify-center pt-20 text-center pr-10 pl-10'>
        
        <h1 className='text-600'>{CHATBOT_NAME}: Your reliable assistant</h1>
          <div className="form-control w-full max-w-xs mt-5">
            <label className="label">
              <span className="label-text">Role Type</span>
            </label>
            <select className="select w-full max-w-xs select-primary" ref={roleRef} onChange={handleRoleSelect} value={currentRole}>
              <option value="">Pick your favorite role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>{role.id}</option>
              ))}
            </select>
          </div>
        <div className={currentRole ? 'my-12' : 'hidden'}>
          <p className='mb-6'>Please type your prompt to chat with me as <span className="font-bold">{currentRole}</span></p>
          <div className="flex flex-col md:flex-row  justify-center" >
          <CopyToClipboard text={hintDialog} copyText={copyText} onCopy={handleCopyText}/>
          </div>
          <div className="flex flex-col md:flex-row  justify-center" >
            <textarea
            placeholder='Input here'
            className= 'textarea textarea-bordered textarea-md w-full max-w-md'
            value={inputValue}
            onChange={handleInput}
            ref={inputRef}
            
            />
          </div>
           <div className="flex flex-col md:flex-row mt-5 justify-center">
           <div className="tooltip" data-tip="Generate new ideas">
            <button className="btn btn-primary md:ml-5 mb-5" onClick={generateReply} disabled={!inputValue}>Generate Ideas</button>
           </div>
           <div className="tooltip" data-tip="Reset current input">
            <button className="btn btn-secondary md:ml-5 mb-5" onClick={resetUserMessage}>Reset input</button>
            </div>
            <div className="tooltip" data-tip="Reset current conversation with existing role">
              <button className="btn btn-secondary md:ml-5 mb-5" onClick={resetConverationwithExistingRole}>Reset Conversation</button>
            </div>
           </div>
           <div className="flex flex-col md:flex-row mt-5 justify-center">
           <div className="tooltip" data-tip="Reset current conversation with no role">
            <button className="btn btn-primary mb-5" onClick={handleRefresh}>new converation</button>
            </div>
            </div>
      </div>
    </div>
    <div className= {currentRole ? 'max-w-md ml-auto mr-auto' : 'hidden'}>
    <div className={!showLoader && errorMessage ? "textarea"  : "hidden" }>
      <div className="alert alert-error shadow-lg">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Error! OpenAI api failed, please contact the administrator.</span>
        </div>
    </div>
      </div>
       <div className={!showLoader ? "textarea" : "hidden"}>
        {
          conversationList.map((item, index) => ( <Fragment key={index}>
          <ChatDialog item = {item}></ChatDialog>
          </Fragment>))
        }
       </div>
       <div className={!showLoader ? "hidden" : "flex items-center justify-center space-x-2 mb-10"}>
       <div
    className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
    role="status">
    <span
      className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
      >Loading...</span
    >
  </div>
       </div>
    </div>
  </div>
  )
}