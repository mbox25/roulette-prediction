
$(document).ready(function(){
    reset();   
});

var lastNumberList = [];
var lastNumberCountMap = {};

var blackMap = {
    2:0, 4:0, 6:0, 8:0, 10:0, 11:0, 13:0, 15:0, 17:0, 
    20:0, 22:0, 24:0, 26:0, 28:0, 29:0, 31:0, 33:0, 35:0
};

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
    if(0 == lastNumberList.length) {
        return;
    }

    lastNumberCountMap[lastNumberList[lastNumberList.length - 1]] = -1;
    lastNumberList = lastNumberList.splice(0, lastNumberList.length - 1);
    var historyStr = '';
    for(var i=0; i<lastNumberList.length; ++i) {
        var num = lastNumberList[i];
        if(37 == num) {
            historyStr += '00,';
        }
        else {
            historyStr += num + ',';
        }
    }
    $('#history-text-area').val(historyStr);

    var newRate = setNumberPrediction();
    setOddEvenPrediction(newRate);
    setBlackRedPrediction(newRate);
    setNumber1to36Prediction(newRate);
}

function addNumber(number) {
    vibrate();

    lastNumberList.push(number);
    lastNumberCountMap[number] = 25;

    var historyStr = '';
    for(var i=0; i<lastNumberList.length; ++i) {
        var num = lastNumberList[i];
        if(37 == num) {
            historyStr += '00,';
        }
        else {
            historyStr += num + ',';
        }
    }
    $('#history-text-area').val(historyStr);
    
    var newRate = setNumberPrediction();
    setOddEvenPrediction(newRate);
    setBlackRedPrediction(newRate);
    setNumber1to36Prediction(newRate);
}

navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
function vibrate() {
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
}

function setNumberPrediction() {
    var count = 0;
    for(var key in lastNumberCountMap) {
        --lastNumberCountMap[key];
        if(0 < lastNumberCountMap[key]) {
            ++count;
        }
    }

    var newRate = 100 / (38 - count);
    for(var i=0; i<38; ++i) {
        var rate = newRate;
        if(0 < lastNumberCountMap[i]) {
            rate = 0;
        }

        $('#number-rate-' + i).text(rate.toFixed(2) + '%');
    }

    return newRate;
}

function setOddEvenPrediction(newRate) {
    var oddRate = 0;
    var evenRate = 0;
    for(var i=1; i<=36; ++i) {
        var rate = newRate;
        if(0 < lastNumberCountMap[i]) {
            continue;
        }

        if(0 == i % 2) {
            evenRate += newRate;
        } 
        else {
            oddRate += newRate;
        }
    }

    $('#odd-rate').text(oddRate.toFixed(1) + '%');
    $('#even-rate').text(evenRate.toFixed(1) + '%');
}

function setBlackRedPrediction(newRate) {
    // var redMap = {
    //     1:0, 3:0, 5:0, 7:0, 9:0, 12:0, 14:0, 16:0, 18:0, 
    //     19:0, 21:0, 23:0, 25:0, 27:0, 30:0, 32:0, 34:0, 36:0
    // }

    var blackRate = 0;
    var redRate = 0;
    for(var i=1; i<=36; ++i) {
        var rate = newRate;
        if(0 < lastNumberCountMap[i]) {
            continue;
        }

        if(i in blackMap) {
            blackRate += newRate;
        } 
        else {
            redRate += newRate;
        }
    }

    $('#black-rate').text(blackRate.toFixed(1) + '%');
    $('#red-rate').text(redRate.toFixed(1) + '%');
}

function setNumber1to36Prediction(newRate) {
    var rate = 0;
    for(var i=1; i<=18; ++i) {
        if(0 < lastNumberCountMap[i]) {
            continue;
        }

        rate += newRate;
    }
    $('#number-1to18-rate').text(rate.toFixed(1) + '%');

    rate = 0;
    for(var i=19; i<=36; ++i) {
        if(0 < lastNumberCountMap[i]) {
            continue;
        }

        rate += newRate;
    }
    $('#number-19to36-rate').text(rate.toFixed(1) + '%');

    rate = 0;
    for(var i=1; i<=12; ++i) {
        if(0 < lastNumberCountMap[i]) {
            continue;
        }

        rate += newRate;
    }
    $('#number-1to12-rate').text(rate.toFixed(1) + '%');

    rate = 0;
    for(var i=13; i<=24; ++i) {
        if(0 < lastNumberCountMap[i]) {
            continue;
        }

        rate += newRate;
    }
    $('#number-13to24-rate').text(rate.toFixed(1) + '%');

    rate = 0;
    for(var i=25; i<=36; ++i) {
        if(0 < lastNumberCountMap[i]) {
            continue;
        }

        rate += newRate;
    }
    $('#number-25to36-rate').text(rate.toFixed(1) + '%');
}


