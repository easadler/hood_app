$(document).ready(function(){

  var timer;
  var delay = 3000; // 0.6 seconds delay after last input

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
  });
  $('#important_features').sortable({
    change: function(event, ui){
         window.clearTimeout(timer);
      timer = window.setTimeout(function(){
        socket.emit('cluster', {data: 'Time to cluster!'});
      }, delay);

    }

  })

  // // Example 1.4: Sortable and connectable lists (within containment)
  // $('#example-1-4 .sortable-list').sortable({
  //   connectWith: '#example-1-4 .sortable-list',
  //   containment: '#containment'
  // });

});