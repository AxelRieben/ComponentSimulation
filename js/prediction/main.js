$('#btn_calculate').click((ev) => {
    try {
        let alpha = parseFloat($('#alpha').val());
        if (alpha > 1 || alpha < 0) {
            alert("Alpha invalid");
        }
        let tau = parseFloat($('#tau').val());
        let tn = parseFloat($('#tn').val());

        let predict = alpha * tn + (1 - alpha) * tau;
        console.log('Response : ', predict);
        let div_result = $('#result');
        div_result.empty();
        div_result.append(predict);
        div_result.slideDown();
    }
    catch (e) {
        console.log('Input error');
    }
});

$('#div_alpha')
    .popup()
;
$('#result').hide();