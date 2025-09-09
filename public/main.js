// Randomises rotation of element with the 'randomRotation' class
document.querySelectorAll(".randomRotation").forEach((element) => {
  let rotateDegrees = Math.random() * 0.02 - 0.01;
  element.style.setProperty("--rotation", `${rotateDegrees}turn`);
});

// Toggle visibility of the sort dropdown menu
const sortToggle = document.querySelector("#sortToggle");
const sortOptions = document.querySelector(".sortOptions");

// Listen for clicks anywhere on the page
document.addEventListener("click", (event) => {
  let clickedToggle = sortToggle.contains(event.target); // Did the user click the sort button?
  let clickedInsideSortOptions = sortOptions.contains(event.target); // Did the user click inside the dropdown?
  let isOpen = sortOptions.dataset.open === "true"; // Current open state

  if (clickedToggle) {
    // Toggle dropdown open/close
    sortOptions.style.setProperty("--xPosition", isOpen ? `150px` : `15px`);
    sortOptions.dataset.open = (!isOpen).toString();
  } else if (!clickedInsideSortOptions) {
    // Close dropdown if clicked outside
    sortOptions.style.setProperty("--xPosition", `150px`);
    sortOptions.dataset.open = "false";
  }
});

// When a sort option is clicked, submit preference to sort entries
document.querySelectorAll(".sortOptions li").forEach((listedItem) => {
  listedItem.addEventListener("click", () => {
    document.querySelector("#sortInput").value = listedItem.dataset.value;
    document.querySelector("#sortForm").submit();
  });
});

// Show or hide the "scroll to top" button based on scroll position
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    document.querySelector(".auto-scrollUp").classList.add("show");
  } else {
    document.querySelector(".auto-scrollUp").classList.remove("show");
  }
});
