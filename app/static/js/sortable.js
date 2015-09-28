$(document).ready(function(){
  console.log('hi')
  // Example 1.1: A single sortable list
  $('#example-1-1 .sortable-list').sortable();

  // Example 1.2: Sortable and connectable lists
  $('#example-1-2 .sortable-list').sortable({
    connectWith: '#example-1-2 .sortable-list'
  });

  // Example 1.3: Sortable and connectable lists with visual helper
  $('#example-1-3 .sortable-list').sortable({
    connectWith: '#example-1-3 .sortable-list',
    placeholder: 'placeholder',
  });

  // Example 1.4: Sortable and connectable lists (within containment)
  $('#example-1-4 .sortable-list').sortable({
    connectWith: '#example-1-4 .sortable-list',
    containment: '#containment'
  });

});