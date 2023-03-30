import React, { useState } from "react";

interface CopyToClipboardProp {
  text: string,
  copyText: string,
  onCopy: (copyText: string) => void
}

const CopyToClipboard: React.FC<CopyToClipboardProp> = ({ text, copyText, onCopy }: CopyToClipboardProp) => {
  const [copied, setCopied] = useState(copyText);
  return (
    <div className="flex flex-row items-center border-solid border-2 border-indigo-600 px-5 py-5 max-w-md mb-5">
      <div className="italic font-bold ">Suggested Prompt:<span className="not-italic ml-2">{text}</span></div>
        <button
          className={`btn btn-primary ml-2 btn-xs`}
          onClick={() => {
            navigator.clipboard.writeText(text);
            setCopied("copied");
            onCopy("copied")
          }}>
          {copyText}
        </button>
    </div>
  );
}

export default CopyToClipboard