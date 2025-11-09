function reverseNumber(num) {
  return parseInt(num.toString().split('').reverse().join(''), 10);
}

const isPalindrome = function(num) {
  return num.toString() === reverseNumber(num).toString();
};


const createMessage = (original) => {
  return (reversed, palindromeStatus) => {
    return `Original: ${original}, Reversed: ${reversed} → ${palindromeStatus ? "Palindrome" : "Not a Palindrome"}`;
  };
};


function handleCheck() {
  try {
    let input = document.getElementById("numInput").value;
    
    if (!input || isNaN(input)) {
      throw new Error("Please enter a valid number!");
    }

    let num = parseInt(input, 10);
    let reversed = reverseNumber(num);
    let palindromeStatus = isPalindrome(num);

    
    let messageGenerator = createMessage(num);
    document.getElementById("result").innerText = messageGenerator(reversed, palindromeStatus);

  } catch (err) {
    document.getElementById("result").innerText = `Error: ${err.message}`;
  }
}
