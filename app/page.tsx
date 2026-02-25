"use client";

import { useEffect, useState } from "react";
import { IoMdCopy } from "react-icons/io";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MdErrorOutline } from "react-icons/md";

type noAsAServiceResponse = {
  reason: string;
};

type Message = {
  message: string;
  type: "copy" | "error" | null;
};

export default function Home() {
  const [reason, setReason] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<Message>({ message: "", type: null });
  const [copied, setCopied] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [updateIcon, setUpdateIcon] = useState(false);

  // Fetches the rejection reason
  async function fetchReason() {
    setLoading(true);

    try {
      const res = await fetch("https://naas.isalman.dev/no", {
        cache: "no-store", // dont reuse old responses
      });

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }

      const data: noAsAServiceResponse = await res.json();
      setReason(data.reason);
    } catch (err) {
      setMessage({
        message: err instanceof Error ? err.message : "Something went wrong",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  // Load one reason on first render
  useEffect(() => {
    fetchReason();
  }, []);

  return (
    <>
      {showMessage && (
        <div className={`message ${message.type != "error" ? "good" : "bad"}`}>
          {message.message}{" "}
          {copied ? (
            <IoIosCheckmarkCircleOutline className="copyIcon" />
          ) : (
            <MdErrorOutline />
          )}
        </div>
      )}

      <div className="main">
        <h1>Random Rejection Reasons</h1>
        <div className="reasonBlock">
          <p>{reason || "No reason yet"}</p>
          <div className="buttons">
            <button
              id="reason"
              onClick={() => fetchReason()}
              disabled={loading}
            >
              {loading ? "Fetching" : "Give me a new reason"}
            </button>
            <button
              id="copy"
              onClick={() => {
                navigator.clipboard.writeText(reason);
                setCopied(true);
                setMessage({ message: "Copied!", type: "copy" });
                setShowMessage(true);
                setUpdateIcon(true);
                setTimeout(() => {
                  setUpdateIcon(false);
                }, 800);
                setTimeout(() => {
                  setCopied(false);
                  setShowMessage(false);
                }, 3000);
              }}
            >
              {updateIcon ? (
                <IoIosCheckmarkCircleOutline className="icon" />
              ) : (
                <IoMdCopy className="icon" />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
