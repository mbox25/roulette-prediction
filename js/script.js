
$(document).ready(function(){
    reset();   
});

var lastNumberList = [];
var lastNumberCountMap = {};
var numberRateMap = {};

var blackMap = {
    2:0, 4:0, 6:0, 8:0, 10:0, 11:0, 13:0, 15:0, 17:0, 
    20:0, 22:0, 24:0, 26:0, 28:0, 29:0, 31:0, 33:0, 35:0
};

var zeroMap = {
    0:0, 37:0
}

function reset() {
    lastNumberList = [];
    lastNumberCountMap = {};

    $('#history-text-area').val('');
    $('#number-input').html('');

    var newRate = setNumberPrediction();
    setOddEvenPrediction(newRate);
    setBlackRedPrediction(newRate);
    setNumber1to36Prediction(newRate);

    var numberInputHtml = '';
    for(var i=1; i<=36; ++i) {
        if(1 == i % 3) {
            numberInputHtml += '<div class="row">';
        }

        var buttonColor = "btn-outline-danger";
        if(i in blackMap) {
            buttonColor = "btn-outline-light"
        }

        numberInputHtml += '<div class="col">' + 
                '<div><button type="button" class="btn ' + buttonColor +'" id="number-button-' + i + '" onclick="addNumber(' + i + ')">' + i + '</button></div>' + 
                '<div class="small text-dark" id="number-rate-' + i + '">2.63%</div>' + 
            '</div>';

        if(0 == i % 3) {
            numberInputHtml += '</div>';
        }
    }

    numberInputHtml += '<div class="row"><div class="col"></div><div class="col">' + 
            '<div><button type="button" class="btn btn-outline-success" id="number-button-0" onclick="addNumber(0)">0</button></div>' + 
            '<div class="small text-dark" id="number-rate-0">2.63%</div>' + 
        '</div>';
    
    numberInputHtml += '<div class="col">' + 
            '<div><button type="button" class="btn btn-outline-success" id="number-button-37" onclick="addNumber(37)">00</button></div>' + 
            '<div class="small text-dark" id="number-rate-37">2.63%</div>' + 
        '</div><div class="col"></div></div>';

    $('#number-input').html(numberInputHtml); 
}

function undo() {
    if(0 == lastNumberList.length) {
        return;
    }

    lastNumberCountMap[lastNumberList[lastNumberList.length - 1]] = -1;
    lastNumberList = lastNumberList.splice(0, lastNumberList.length - 1);
    displayNumber();

    var newRate = setNumberPrediction();
    setOddEvenPrediction(newRate);
    setBlackRedPrediction(newRate);
    setNumber1to36Prediction(newRate);
}

function displayNumber() {
    var historyStr = '';
    if(0 != lastNumberList.length) {
        for(var i=0; i<lastNumberList.length-1; ++i) {
            var num = lastNumberList[i];
            if(37 == num) {
                historyStr += '00,';
            }
            else {
                historyStr += num + ',';
            }
        }
        var num = lastNumberList[lastNumberList.length-1];
        if(37 == num) {
            historyStr += '00◀';
        }
        else {
            historyStr += num + '◀';
        }
    }
    $('#history-text-area').val(historyStr);
}

function addNumber(number) {
    vibrate();
    $('#history-text-area').focus();

    lastNumberList.push(number);
    lastNumberCountMap[number] = 38;
    if(38 < lastNumberList.length) {
        lastNumberList = lastNumberList.splice(1, lastNumberList.length - 1);
    }
    displayNumber();
    
    setNumberPrediction();
    setOddEvenPrediction();
    setBlackRedPrediction();
    setNumber1to36Prediction();
}

navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
function vibrate() {
    if (navigator.vibrate) {
        navigator.vibrate(10);
    }
}

function setNumberPrediction() {
    var preRate = 0;
    var count = 0;
    for(var key in lastNumberCountMap) {
        --lastNumberCountMap[key];
        if(0 < lastNumberCountMap[key]) {
            var currRate = (38 - lastNumberCountMap[key]) * (100 / 38) / 38;
            numberRateMap[key] = currRate;
            preRate += currRate;
            ++count;
        }
    }

    var newRate = (100 - preRate) / (38 - count);
    for(var i=0; i<38; ++i) {
        var rate = newRate;
        if(0 < lastNumberCountMap[i]) {
            rate = numberRateMap[i];
        }

        numberRateMap[i] = rate;

        if(4.5 < rate) {
            if(i in blackMap) {
                $('#number-button-' + i).removeClass('btn btn-outline-light');
                $('#number-button-' + i).addClass('btn btn-dark');
            }
            else if(i in zeroMap) {
                $('#number-button-' + i).removeClass('btn btn-outline-success');
                $('#number-button-' + i).addClass('btn btn-success');
            } 
            else {
                $('#number-button-' + i).removeClass('btn btn-outline-danger');
                $('#number-button-' + i).addClass('btn btn-danger');
            }
        }
        else {
            if(i in blackMap) {
                $('#number-button-' + i).removeClass('btn btn-dark');
                $('#number-button-' + i).addClass('btn btn-outline-light');
            }
            else if(i in zeroMap) {
                $('#number-button-' + i).removeClass('btn btn-success');
                $('#number-button-' + i).addClass('btn btn-outline-success');    
            } 
            else {
                $('#number-button-' + i).removeClass('btn btn-danger');
                $('#number-button-' + i).addClass('btn btn-outline-danger');
            }
        }

        $('#number-rate-' + i).text(rate.toFixed(2) + '%');
    }
}

function setOddEvenPrediction() {
    var oddRate = 0;
    var evenRate = 0;
    for(var i=1; i<=36; ++i) {
        if(0 == i % 2) {
            evenRate += numberRateMap[i];
        } 
        else {
            oddRate += numberRateMap[i];
        }
    }

    if(50 < oddRate) {
        $('#odd-rate').css('background-color', 'red');
    }
    else {
        $('#odd-rate').css('background-color', 'black');
    }

    if(50 < evenRate) {
        $('#even-rate').css('background-color', 'red');
    }
    else {
        $('#even-rate').css('background-color', 'black');
    }

    $('#odd-rate').text(oddRate.toFixed(1) + '%');
    $('#even-rate').text(evenRate.toFixed(1) + '%');
}

function setBlackRedPrediction() {
    // var redMap = {
    //     1:0, 3:0, 5:0, 7:0, 9:0, 12:0, 14:0, 16:0, 18:0, 
    //     19:0, 21:0, 23:0, 25:0, 27:0, 30:0, 32:0, 34:0, 36:0
    // }

    var blackRate = 0;
    var redRate = 0;
    for(var i=1; i<=36; ++i) {
        if(i in blackMap) {
            blackRate += numberRateMap[i];
        } 
        else {
            redRate += numberRateMap[i];
        }
    }

    if(50 < blackRate) {
        $('#black-rate').css('background-color', 'red');
    }
    else {
        $('#black-rate').css('background-color', 'black');
    }

    if(50 < redRate) {
        $('#red-rate').css('background-color', 'red');
    }
    else {
        $('#red-rate').css('background-color', 'black');
    }

    $('#black-rate').text(blackRate.toFixed(1) + '%');
    $('#red-rate').text(redRate.toFixed(1) + '%');
}

function setNumber1to36Prediction() {
    var rate = 0;
    for(var i=1; i<=18; ++i) {
        rate += numberRateMap[i];
    }
    $('#number-1to18-rate').text(rate.toFixed(1) + '%');

    if(50 < rate) {
        $('#number-1to18-rate').css('background-color', 'red');
    }
    else {
        $('#number-1to18-rate').css('background-color', 'black');
    }

    rate = 0;
    for(var i=19; i<=36; ++i) {
        rate += numberRateMap[i];
    }
    $('#number-19to36-rate').text(rate.toFixed(1) + '%');

    if(50 < rate) {
        $('#number-19to36-rate').css('background-color', 'red');
    }
    else {
        $('#number-19to36-rate').css('background-color', 'black');
    }

    rate = 0;
    for(var i=1; i<=12; ++i) {
        rate += numberRateMap[i];
    }
    $('#number-1to12-rate').text(rate.toFixed(1) + '%');

    if(40 < rate) {
        $('#number-1to12-rate').css('background-color', 'red');
    }
    else {
        $('#number-1to12-rate').css('background-color', 'black');
    }

    rate = 0;
    for(var i=13; i<=24; ++i) {
        rate += numberRateMap[i];
    }
    $('#number-13to24-rate').text(rate.toFixed(1) + '%');

    if(40 < rate) {
        $('#number-13to24-rate').css('background-color', 'red');
    }
    else {
        $('#number-13to24-rate').css('background-color', 'black');
    }

    rate = 0;
    for(var i=25; i<=36; ++i) {
        rate += numberRateMap[i];
    }
    $('#number-25to36-rate').text(rate.toFixed(1) + '%');

    if(40 < rate) {
        $('#number-25to36-rate').css('background-color', 'red');
    }
    else {
        $('#number-25to36-rate').css('background-color', 'black');
    }
}


