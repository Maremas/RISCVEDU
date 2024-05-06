document
  .getElementById("quizForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    // Check user's answers and calculate score
    // For simplicity, let's assume the correct answer for q1 is "paris"
    const userAnswer1 = document.querySelector("#textexercise").value;
    // if (userAnswer1 === "10") {
    //   document.querySelector("#false").style.display = "none";
    //   document.querySelector("#correct").style.display = "block";
    // } else {
    //   document.querySelector("#correct").style.display = "none";
    //   document.querySelector("#false").style.display = "block";
    // }
    const correctAnswer = document.querySelector("#correct");
    const falseAnswer = document.querySelector("#false");
    if (userAnswer1 === "10") {
      falseAnswer.style.display = "none";
      correctAnswer.style.display = "block";
    } else {
      correctAnswer.style.display = "none";
      falseAnswer.style.display = "block";
    }
  });
