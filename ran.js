function generateCodeName() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomLetters = Array.from(
    { length: 4 },
    () => letters[Math.floor(Math.random() * letters.length)]
  ).join("");
  const randomDigits = Math.floor(1000 + Math.random() * 9000); // Random 4-digit number
  return `${randomLetters}-${randomDigits}`;
}

// Function to refresh the ticket
const refreshTicket = () => {
  setTicketNumber(generateTicketNumber()); // Update ticket number
  setCodeName(generateCodeName()); // Update code name
};
