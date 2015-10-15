$(document).ready(function(){

  $(function(){
    $( ".slider" ).slider({max: 1, min: -1,slide: function(event, ui) {
      console.log(ui.value);
    }, step: 0.01 });
    // $('.ui-slider-handle').css({width:150,'text-align': 'center', height: 23});

})

  plotData(map_data)
  var timer;
  var delay = 0; // 0.6 seconds delay after last input

  $('#important_features').change(function(){
    console.log('here')
    //  window.clearTimeout(timer);
    //     timer = window.setTimeout(function(){
    //       socket.emit('cluster', {data: 'Time to cluster!'});
    //     }, delay);
    }) 


  // Example 1.3: Sortable and connectable lists with visual helper
  $('#example-1-3 .sortable-list').sortable({
    connectWith: '#example-1-3 .sortable-list',
    placeholder: 'placeholder',
    update: function(event, ui){
          var arr = [];
            $("ul#important_features li").each(function() { arr.push($(this).text()) });
          
         window.clearTimeout(timer);
        timer = window.setTimeout(function(){

          socket.emit('cluster', {data: arr});
        }, delay)}
  });

  // // Example 1.4: Sortable and connectable lists (within containment)
  // $('#example-1-4 .sortable-list').sortable({
  //   connectWith: '#example-1-4 .sortable-list',
  //   containment: '#containment'
  // });

});