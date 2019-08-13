
$(document).ready(function(){
    reset();   
});

var blackMap = {
    2:0, 4:0, 6:0, 8:0, 10:0, 11:0, 13:0, 15:0, 17:0, 
    20:0, 22:0, 24:0, 26:0, 28:0, 29:0, 31:0, 33:0, 35:0
};

function reset() {
    $('#history-text-area').val('');
    $('#number-input').html('');
    setNumberPrediction();
    setOddEvenPrediction();
    setBlackRedPrediction();

    var numberInputHtml = '';
    for(var i=1; i<=36; ++i) {
        if(1 == i % 5) {
            numberInputHtml += '<div class="row">';
        }

        var buttonColor = "btn-danger";
        if(i in blackMap) {
            buttonColor = "btn-dark"
        }

        numberInputHtml += '<div class="col">' + 
                '<div><button type="button" class="btn ' + buttonColor +'" onclick="addNumber(' + i + ')">' + i + '</button></div>' + 
                '<div class="small text-dark" id="number-rate-' + i + '">2.63%</div>' + 
            '</div>';

        if(0 == i % 5) {
            numberInputHtml += '</div>';
        }
    }

    numberInputHtml += '<div class="col">' + 
            '<div><button type="button" class="btn btn-success" onclick="addNumber(0)">0</button></div>' + 
            '<div class="small text-dark" id="number-rate-0">2.63%</div>' + 
        '</div>';
    
    numberInputHtml += '<div class="col">' + 
            '<div><button type="button" class="btn btn-success" onclick="addNumber(37)">00</button></div>' + 
            '<div class="small text-dark" id="number-rate-37">2.63%</div>' + 
        '</div>';

    $('#number-input').html(numberInputHtml); 
}

function undo() {

    // $('#history-text-area').val($('#history-text-area').val().substr());

    // setNumberPrediction();
    // setOddEvenPrediction();
    // setBlackRedPrediction();
}

function addNumber(number) {
    if(37 == number) {
        number = '00';  
    }
    $('#history-text-area').val($('#history-text-area').val() + number + ' ');
    vibrate();
    
    setNumberPrediction();
    setOddEvenPrediction();
    setBlackRedPrediction();
}

navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
function vibrate() {
    if (navigator.vibrate) {
        navigator.vibrate(300);
    }
    else {
        alert("진동을 지원하지 않는 기종 입니다.");
    }
}

function setNumberPrediction() {
    var historyData = $('#history-text-area').val();
    var numberList = historyData.split(' ');
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
    var numberList = historyData.split(' ');
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
    var evenRate = stdRate + (oddCount - evenCount) * 3.5;
    var oddRate = stdRate + (evenCount - oddCount) * 3.5;

    $('#odd-rate').text(oddRate.toFixed(1) + '%');
    $('#even-rate').text(evenRate.toFixed(1) + '%');
}

function setBlackRedPrediction() {
    // var redMap = {
    //     1:0, 3:0, 5:0, 7:0, 9:0, 12:0, 14:0, 16:0, 18:0, 
    //     19:0, 21:0, 23:0, 25:0, 27:0, 30:0, 32:0, 34:0, 36:0
    // }

    var historyData = $('#history-text-area').val();
    var numberList = historyData.split(' ');
    var blackCount = 0;
    var redCount = 0;
    for(var i=0; i<numberList.length -1; ++i) {
        var number = numberList[i];
        if(0 == number || '00' == number) {
            continue;
        }

        if(number in blackMap) {
            ++blackCount;
        }
        else {
            ++redCount;
        }
    }

    var stdRate = 18 / 38 * 100;
    var blackRate = stdRate + (redCount - blackCount) * 5;
    var redRate = stdRate + (blackCount - redCount) * 5;

    $('#black-rate').text(blackRate.toFixed(1) + '%');
    $('#red-rate').text(redRate.toFixed(1) + '%');
}
