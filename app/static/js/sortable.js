$(document).ready(function(){

  $(function(){
    $( ".slider" ).slider({max: 1, min: -1,slide: function(event, ui) {
      var name = $(this).attr('id')
      data_dict = {}
      data_dict[name] = ui.value
      var not_clicked_elements = $(this).siblings('.show');
      not_clicked_elements.each(function() { data_dict[$(this).attr('id')] = $(this).slider('option', 'value') });
      socket.emit('cluster', {data: data_dict})
    }, step: 0.01 });

})

  plotData(map_data)
  var timer;
  var delay = 0.0; // 0.6 seconds delay after last input

  $('#important_features').change(function(){
    console.log('here')
    //  window.clearTimeout(timer);
    //     timer = window.setTimeout(function(){
    //       socket.emit('cluster', {data: 'Time to cluster!'});
    //     }, delay);
    }) 


  // Example 1.3: Sortable and connectable lists with visual helper
  $('label').click(function() {
            arr = []
         $("label.active input").each(function() { arr.push($(this).val()) });
            if(!$(this).hasClass('active')){
              // arr.push($(this).children().val())
              $('#' + $(this).children().val()).toggleClass('show')
            } else {
              // arr.pop()
            $('#' + $(this).children().val()).toggleClass('show')

            }
         window.clearTimeout(timer);
        timer = window.setTimeout(function(){


          // socket.emit('cluster', {data: arr});
        }, delay)
  })


  // // Example 1.4: Sortable and connectable lists (within containment)
  // $('#example-1-4 .sortable-list').sortable({
  //   connectWith: '#example-1-4 .sortable-list',
  //   containment: '#containment'
  // });

});