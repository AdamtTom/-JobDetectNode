const magnify = 100; // Magnification radius in pixels
let magnifyActive = true; // Whether magnifying lens is active or not
const magnifier = document.querySelector('.magnifier');
const body = document.querySelector('body');

// Function to activate the magnifying lens
function toggleMagnify() {
  if (magnifyActive){
    magnifyActive = false;
    magnifier.style.display = 'none';
    body.style.cursor = 'auto'

  } else {
    magnifyActive = true;
    magnifier.style.display = 'block';
    body.style.cursor = 'none'
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

function responseHandler(data) {
    document.getElementById("loader").style.display = 'none'
    if (data.fake)
        document.getElementById("results-label").innerHTML = `There is a ${data.proba}% chance that this job posting ${'<span class="red-highlight">IS</span>' } Fake.`
    else
        document.getElementById("results-label").innerHTML = `There is a ${data.proba}% chance that this job posting ${'<span class="green-highlight">IS NOT</span>' } Fake.`
}

$('#submitBtn').click(() => {
    const formData = $('#form').serializeArray().reduce((function(acc, val) {
        acc[val.name] = val.value;
        return acc;
      }), {});
      console.log(formData)

    let {title, description} = document.form
    if(!title.reportValidity() || !description.reportValidity()){
        return;
    }
    document.getElementById("results").style.display = 'flex'
    document.getElementById("loader").style.display = 'block'
    $('#submitBtn').hide();

    $.ajax({
        url: '/predict',
        type: 'POST',
        data: formData,
        success: responseHandler
    })
});

$('#check').click(function() {
    $('#switch-toggle').toggle();
  });