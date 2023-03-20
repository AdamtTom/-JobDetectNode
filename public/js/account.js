function responseHandler(data){
    $('#name').attr('value', data.name)
    $('#email').attr('value', data.email)
    newElements = ''
    data.predictions.forEach((pred, index) => {
        if (pred.fake) result = `${'<span class="red-highlight">Fake</span>'} (${pred.proba}% chance)`
        else result =  `${'<span class="green-highlight">Not Fake</span>'} (${pred.proba}% chance)`
        newElements += `<div class="form-control">
        <label class="prediction-title">Prediction ${index+1}</label>
        <label>Job Posting Details</label>
        <textarea class="multiline">${pred.text}</textarea>
        <label class="pred-label">Prediction: ${result}</label>
      </div>`
      
    });
    $('#predictions').html(newElements)
}

$(document).ready(function() {
    $.ajax({
        url: '/sessionInfo',
        type: 'GET',
        success: responseHandler
    })
  });