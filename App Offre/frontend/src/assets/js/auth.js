document.addEventListener("DOMContentLoaded", function() {
  document.body.addEventListener("click", function(event) {
      const signupBtn = document.getElementById("signup-btn");
      const signinBtn = document.getElementById("signin-btn");
      const mainContainer = document.querySelector(".container");

      if (event.target === signupBtn || event.target === signinBtn) {
          mainContainer.classList.toggle("change");
      }
  });
});



  
  function openModal(modalId) {
    var modal = document.getElementById(modalId);
    modal.style.display = 'flex';
  }
  
  function closeModal(modalId) {
    var modal = document.getElementById(modalId);
    modal.style.display = 'none';
  }
  
  window.onclick = function (event) {
    var modal = document.getElementById('myModal');
    if (event.target == modal) {
      closeModal('myModal');
    }
  };
  


  
 