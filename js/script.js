
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
                '<div id="number-rate-' + i + '">2.63%</div>' + 
            '</div>';

        if(0 == i % 5) {
            numberInputHtml += '</div>';
        }
    }

    numberInputHtml += '<div class="col">' + 
            '<div><button type="button" class="btn btn-primary" onclick="addNumber(0)">0</button></div>' + 
            '<div id="number-rate-0">2.63%</div>' + 
        '</div>';
    
    numberInputHtml += '<div class="col">' + 
            '<div><button type="button" class="btn btn-primary" onclick="addNumber(37)">00</button></div>' + 
            '<div id="number-rate-37">2.63%</div>' + 
        '</div>';

    $('#number-input').html(numberInputHtml);
});

function addNumber(number) {
    if(37 == number) {
        number = '00';  
    }
    $('#history-text-area').val($('#history-text-area').val() + number + ',');

    setNumberPrediction();
    setOddEvenPrediction();
}

function setNumberPrediction() {
    var historyData = $('#history-text-area').val();
    var numberList = historyData.split(',');
    var numberCountMap = {};
    for(var i=0; i<numberList.length -1; ++i) {
        var number = numberList[i];
        if('00' == number) {
            number = 37;  
        }

        if(number in numberCountMap) {
            ++numberCountMap[number];
        }
        else {
            numberCountMap[number] = 1;
        }
    }

    var stdRate = 100 / 38;
    var remainRate = 0;
    for(numberKey in numberCountMap) {
        remainRate += stdRate - (stdRate * (20 - numberCountMap[numberKey]) / 20);
    }

    var addRate = remainRate / 38;
    for(var i=0; i<=37; ++i) {
        var newRate = stdRate + addRate;
        if(i in numberCountMap) {
            newRate = (stdRate * (20 - numberCountMap[numberKey]) / 20) + addRate;
        }

        $('#number-rate-' + i).text(newRate.toFixed(2) + '%');
    }
}

function setOddEvenPrediction() {
    var historyData = $('#history-text-area').val();
    var numberList = historyData.split(',');
    var oddCount = 0;
    var evenCount = 0;
    for(var i=0; i<numberList.length -1; ++i) {
        var number = numberList[i];
        if(0 == number || '00' == number) {
            continue;
        }

        if(0 == number % 2) {
            ++evenCount;
        }
        else {
            ++oddCount;
        }
    }

    var stdRate = 18 / 38 * 100;
    var evenRate = stdRate + (oddCount - evenCount) * 3;
    var oddRate = stdRate + (evenCount - oddCount) * 3;

    $('#odd-rate').text(oddRate.toFixed(2) + '%');
    $('#even-rate').text(evenRate.toFixed(2) + '%');
}

function setBlackRedPrediction() {

}