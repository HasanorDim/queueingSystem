import React, { useEffect } from "react";

const prompts = [
  (ticket, counter) =>
    `Now serving ticket number ${ticket}. Please proceed to counter ${counter}.`,
  (ticket, counter) =>
    `Ticket number ${ticket}, kindly proceed to counter ${counter}.`,
  // (ticket, counter) => `Ticket ${ticket}, counter ${counter}.`,
];

const priorityPrompt = (ticket, counter = "Assesment") =>
  `Priority ticket number ${ticket}, please proceed to counter ${counter}.`;

const Ding = ({ ticketNumber, counterNumber, isPriority, play }) => {
  useEffect(() => {
    if (!play || !ticketNumber || !counterNumber) return;

    // Play the ding sound first
    const ding = new Audio("/alert.mp3");
    ding.play();

    // Speak after delay
    const speak = () => {
      const utterance = new SpeechSynthesisUtterance();
      utterance.text = isPriority
        ? priorityPrompt(ticketNumber, counterNumber)
        : prompts[Math.floor(Math.random() * prompts.length)](
            ticketNumber,
            counterNumber
          );
      utterance.lang = "en-US";
      utterance.rate = 1;
      window.speechSynthesis.speak(utterance);
    };

    const timeout = setTimeout(speak, 1000);
    return () => clearTimeout(timeout);
  }, [ticketNumber, counterNumber, isPriority, play]);

  return null;
};

// ========== Demo Page with Mock Data ==========
// const QueueAnnouncementDemo = () => {
//   const [playNow, setPlayNow] = useState(false);

//   // Sample mock data
//   const mockTicket = {
//     number: 1,
//     counter: 3,
//     priority: true, // change this to false for standard
//   };

//   const handleAnnounce = () => {
//     setPlayNow(false); // reset to allow retrigger
//     setTimeout(() => setPlayNow(true), 100);
//   };

//   return (
//     <div className="p-6 space-y-4">
//       <h2 className="text-2xl font-bold">Queue Announcement Demo</h2>

//       <button
//         onClick={handleAnnounce}
//         className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition"
//       >
//         🔊 Announce Ticket
//       </button>

//       <Ding
//         ticketNumber={mockTicket.number}
//         counterNumber={mockTicket.counter}
//         isPriority={mockTicket.priority}
//         play={playNow}
//       />
//     </div>
//   );
// };

export default Ding;
