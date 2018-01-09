$(document).ready(function(){
  var $scope = $('#passenger-data-page');

  if ($scope.length === 0) return;

  var $countryCodeModal = $('#country-code-modal');

  $countryCodeModal.on('click', 'li[data-cc]', function(e) {
    var $el = $(e.currentTarget),
        $phoneField = $('.phone-field', $scope);

    $('#cc', $phoneField).val($el.data('cc'));
    $('.cc-select img', $phoneField).replaceWith($('img', $el).clone());

    $countryCodeModal.closeModal();
  });

  var baggageLineTemplate = function(type, weight, name) {
    var iconRotation = type == 'departure' ? 'rotate90' : 'rotate270';

    return('<div data-type=\''+type+'\' data-weight=\''+weight+'\' class=\'row selected-baggage\'> \
             <div class=\'col s8\'> \
               <i class=\'material-icons airplane '+iconRotation+'\'>airplanemode_active</i> \
               <b>' + name +'</b> \
             </div> \
             <div class=\'col s4 weight-and-amount\'> \
               <span class=\'weight\'>'+weight+'kg</span> x <span class=\'amount\'>1</span> \
             </div> \
           </div>');
  };

  var updateBaggageData = function(type) {
    var $resultsList = $('#' + type + ' .results-list', $scope);
    $resultsList.html('');

    $('#' + type + '-modal .option-block').each(function(i){
      var $optionBlock = $(this),
          type = $optionBlock.data('type'),
          name = $('h4 > span', $optionBlock).text();

      $('option:selected', $optionBlock).each(function(){
        var $option = $(this),
            weight = $option.prop('value');

        if (weight && weight !== '') {
          var $existingLine = $('.row[data-type=\''+type+'\'][data-weight=\''+weight+'\']', $resultsList);

          if ($existingLine.length > 0) {
            var $amount = $('.amount', $existingLine);
            $amount.text(parseInt($amount.text(), 10) + 1);
          } else {
            var $newLine = $('<div/>').html(baggageLineTemplate(type, weight, name)).html();
            if (type === 'departure') {
              $resultsList.prepend($newLine);
            } else {
              $resultsList.append($newLine);
            }
          }
        }
      });
    });
  };

  $('#cabin-bag-modal', $scope).on('change', 'select', function(){
    updateBaggageData('cabin-bag');
  });

  $('#checked-bag-modal', $scope).on('change', 'select', function(){
    updateBaggageData('checked-bag');
  });
});
