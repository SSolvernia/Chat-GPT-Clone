import { createContext, useEffect, useRef, useState } from "react";
import { sendMsgToAI } from "./OpenAi";
export const ContextApp = createContext();

const AppContext = ({ children }) => {
  const [showSlide, setShowSlide] = useState(false);
  const [Mobile, setMobile] = useState(false);
  const [chatValue, setChatValue] = useState("");
  const [personaKey, setPersonaKey] = useState('dorothy');
  const [botEmotion, setBotEmotion] = useState(null);
  const [message, setMessage] = useState([
    {
      text: `hola soy ${personaKey}`,
      isBot: true,
    },
  ]);
  const msgEnd = useRef(null);

  useEffect(() => {
    msgEnd.current.scrollIntoView();
  }, [message]);

  // button Click function
  const handleSend = async () => {
    const text = chatValue;
    setChatValue("");
    setMessage([...message, { text, isBot: false }]);
    const res = await sendMsgToAI(text, personaKey);
    const botText = typeof res === 'object' && res !== null ? res.text : res;
    const emotion = typeof res === 'object' && res !== null ? res.emotion : null;
    setBotEmotion(emotion ?? null);
    setMessage([
      ...message,
      { text, isBot: false },
      { text: botText, isBot: true, emotion },
    ]);
  };

  // Enter Click function
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  // Query Click function
  const handleQuery = async (e) => {
    const text = e.target.innerText;
    setMessage([...message, { text, isBot: false }]);
    const res = await sendMsgToAI(text, personaKey);
    const botText = typeof res === 'object' && res !== null ? res.text : res;
    const emotion = typeof res === 'object' && res !== null ? res.emotion : null;
    setBotEmotion(emotion ?? null);
    setMessage([
      ...message,
      { text, isBot: false },
      { text: botText, isBot: true, emotion },
    ]);
  };
  return (
    <ContextApp.Provider
      value={{
        showSlide,
        setShowSlide,
        Mobile,
        setMobile,
        chatValue,
        setChatValue,
        handleSend,
        message,
        msgEnd,
        handleKeyPress,
        handleQuery,
        personaKey,
        setPersonaKey,
        botEmotion,
      }}
    >
      {children}
    </ContextApp.Provider>
  );
};
export default AppContext;
