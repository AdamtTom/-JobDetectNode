const magnify = 100; // Magnification radius in pixels
let magnifyActive = true; // Whether magnifying lens is active or not
const magnifier = document.querySelector('.magnifier');

// Function to activate the magnifying lens
function toggleMagnify() {
  if (magnifyActive){
    magnifyActive = false;
    magnifier.style.display = 'none';
  } else {
    magnifyActive = true;
    magnifier.style.display = 'block';
  }
}

// Function to deactivate the magnifying lens
function deactivateMagnify() {
  
}

window.addEventListener('mousemove', function(e) {
    if (magnifyActive){
        const magnifier = document.querySelector('.magnifier');
        const x = e.pageX;
        const y = e.pageY;
        magnifier.style.transition = 'transform 0.1s ease-out';
        magnifier.style.transform = `translate(${x - magnify}px, ${y - magnify}px) scale(2)`;
    }
    
  });


// Event listener for switch toggle
const switchToggle = document.querySelector('#switch-toggle');
switchToggle.addEventListener('change', function() {
  toggleMagnify()
});