"use client";

import { useEffect, useState } from "react";
import { IoMdCopy } from "react-icons/io";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MdErrorOutline } from "react-icons/md";

type noAsAServiceResponse = {
  reason: string;
};

export default function Home() {
  const [reason, setReason] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  // Fetches the rejection reason
  async function fetchReason() {
    setLoading(true);
    setMessage("");

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
      setMessage(err instanceof Error ? err.message : "Something went wrong");
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
        <div className={`message ${copied ? "good" : "bad"}`}>
          {message}{" "}
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
                setMessage("Copied!");
                setShowMessage(true);
                setTimeout(() => {
                  setCopied(false);
                  setShowMessage(false);
                }, 3000);
              }}
            >
              {copied ? (
                <IoIosCheckmarkCircleOutline id="copyIcon" />
              ) : (
                <IoMdCopy className="copyIcon" />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
