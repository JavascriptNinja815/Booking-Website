var buttonContainer = $('#sidebar[role=navigation]').find('> div.panel > div.panel-body.last');
var oldButton = buttonContainer.find('a');
$('<button>', {id: 'backButton'})
    .text(buttonContainer.text())
    .addClass(oldButton.attr('class'))
    .attr('data-url', oldButton.attr('href'))
    .on('click', function (evt) {
        window.location.href = $(evt.currentTarget).attr('data-url');
    })
    .appendTo(buttonContainer);
oldButton.remove();
