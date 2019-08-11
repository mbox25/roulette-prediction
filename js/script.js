
function test() {
    alert('test');
}

$(document).ready(function(){
    // init number input
    var numberInputHtml = '';
    for(var i=1; i<=36; ++i) {
        if(1 == i % 5) {
            numberInputHtml += '<div class="row">';
        }

        numberInputHtml += '<div class="col">' + 
                '<div><button type="button" class="btn btn-primary" onclick="addNumber(' + i + ')">' + i + '</button></div>' + 
                '<div id="number-rate-1">0.0%</div>' + 
            '</div>';

        if(0 == i % 5) {
            numberInputHtml += '</div>';
        }
    }

    numberInputHtml += '<div class="col">' + 
            '<div><button type="button" class="btn btn-primary" onclick="addNumber(0)">0</button></div>' + 
            '<div id="number-rate-1">0.0%</div>' + 
        '</div>';
    
    numberInputHtml += '<div class="col">' + 
            '<div><button type="button" class="btn btn-primary" onclick="addNumber(37)">00</button></div>' + 
            '<div id="number-rate-1">0.0%</div>' + 
        '</div>';

    $('#number-input').html(numberInputHtml);
});

function addNumber(number) {
    $('#history-text-area').val(
        $('#history-text-area').val() + number + ',');
}