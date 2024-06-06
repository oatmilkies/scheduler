import { useState } from "react";

export default function useVisualMode(initial) {
  const [history, setHistory] = useState([initial]);

  //Update the mode - helps users go from one component view to another
  function transition(newMode, replace = false) {
    setHistory(prev => {
      const history = [...prev];
      if (replace && history.length > 0) {
        history[history.length - 1] = newMode; // Replace the last element
      } else {
        history.push(newMode); // Add new mode to history
      }
      return history;
    });
  }

  //Return to previous mode - if user doesn't want to book appt anymore
  function back() {
    if (history.length > 1) {
      setHistory(prev => [...prev.slice(0, prev.length - 1)]);
    }
  }

  return { mode: history[history.length - 1], transition, back };
}