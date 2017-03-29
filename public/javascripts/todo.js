var lb;
var lb_id;
var PAGE_LENGTH = 5;
var CURRENT_PAGE = 1;
var PAGE_NUMBER = 0;
var QUANTITY_SHOW = 0;
var STATE = "all";          // show state var: "all", "active", "completed"
var tasks = [];


$(document).ready(function () {

  GetRequest();

  // input name of task and added after press key "Enter" or button "Add task"
  $("#search").keyup(function (event) {
    if (($("#search").val() != '') && (event.keyCode == 13)) {
      NewTask();
      //RenameTasks();
      Counters();
    }
  });

  // initial counting of tasks
  Counters();

  // check/uncheck all tasks
  $('#ctrl-cb').click(function () {
    var a = tasks.length,
      b = 0;

    tasks.forEach(function (task) {
      if (task.done === true) {
        b++;
      }
    });
    if (a != 0 && b != a) {
      tasks.forEach(function (task) {
        task.done = true;
      });
    } else if (a != 0 && b == a) {
      tasks.forEach(function (task) {
        task.done = false;
      });
    }
    Counters();
  });

  // add task button
  $('#add-task').click(function () {
    if ($("#search").val() != '') {
      NewTask();
      Counters();
    }
  });

  //events on <ul>
  // delete task
  $('ul').on('click', '.destroy', function () {
    var deleteId = $(this).parent().attr('id');
    DeleteRequest(deleteId);
    QUANTITY_SHOW--;
    Counters();
  });
  // check/uncheck ctrl checkbox
  $('ul').on('click', '.cb', CtrlCheck);

  // delete all completed tasks
  $('#del-completed').click(function () {
    DoneDeleteRequest();
    SetCurPage();
    //RenameTasks();
    Counters();
  });
  // reset ctrl checkbox to unchecked
  //RenameTasks();

  // rename after dbclk on name of task
  $('ul').on('dblclick', '.label-task', function () {
    //window.lb = $('.label-task').index(this);
    window.lb = $(this);
    window.lb_id = $(this).parent().attr('id');
    $(this).attr("contenteditable", true);
    $(this).focus();
    $('.label-task').keydown(function (event) {
      if ((event.keyCode == 13)) {
        $(window.lb).attr("contenteditable", false);
        tasks.forEach(function (task) {
          if (task.id === window.lb_id) {
            task.name = $(window.lb).text();
          }
        });
      }
    });
  });
  // click outside of editable label
  $(document).mouseup(function (event) {   // событие клика по веб-документу
    var lab = window.lb; // тут указываем ID элемента
    if (!$(lab).is(event.target)                 // если клик был не по нашему блоку
      && $(lab).has(event.target).length === 0) { // и не по его дочерним элементам
      $(lab).attr("contenteditable", false); // меняем его аттрибут
      tasks.forEach(function (task) {
        if (task.id === window.lb_id) {
          task.name = $(window.lb).text();
        }
      });
    }
  });
  // show only completed
  $('#Completed').on('click', SetCurPage);
  $('#Completed').on('click', SetShowCompleted);

  // show only not completed
  $('#Active').on('click', SetCurPage);
  $('#Active').on('click', SetShowActive);

  // show all
  //$('#All').on('click', SetCurPage);
  $('#All').on('click', SetShowAll);

  // numeric links
  $('.page-links-list').on('click', '.page-links', PageShow);

  // arrows links
  $('.page-ctrl').on('click', '.border-links', PageShowArrows);

  // Logging tasks
  $('#Log').on('click', GetRequest);

});

// add new task
function NewTask() {
  var task = {name: $("#search").val(), done: false};
  var taskId = PostRequest(task);

  //clear input text area
  $('#search').val('');
}

// function RenameTasks() {
//   tasks.forEach(function (task, i) {
//     task.id = "fred-" + (i + 1);
//   });
// }

function CtrlCheck() {
  var checkingId = $(this).parent().attr('id');
  checkPatchRequest(checkingId);
  // tasks.forEach(function (task) {
  //   if (task.id === a) {
  //     if (task.done === false) {
  //       $(task).attr('done', true);
  //     } else {
  //       $(task).attr('done', false);
  //     }
  //   }
  // });
  Counters();
}

function Counters() {
  var a = tasks.length,
    b = 0,
    c = 0;
  tasks.forEach(function (task) {
    if (task.done === true) {
      b++;
    }
    else {
      c++;
    }
  });

  $('#all-counter').text("All: " + a);
  $("#comp-counter").text("Completed: " + b);
  $("#notcomp-counter").text("Active: " + c);

  if (b === a && b != 0) {
    $('#ctrl-cb').prop("checked", true);
  }
  else {
    $('#ctrl-cb').prop("checked", false);
  }
  Show();
}

// set show state functions
function SetShowAll() {
  STATE = "all";
  Show();
}

function SetShowCompleted() {
  STATE = "completed";
  Show();
}

function SetShowActive() {
  STATE = "active";
  Show();
}

// set current page
function SetCurPage() {
  CURRENT_PAGE = 1;
}

// show numeric linked page
function PageShow(event) {
  var a = $(event.target).index();
  CURRENT_PAGE = a + 1;
  Show();
}

// show arrows linked page
function PageShowArrows() {
  var arrow_id = $(event.target).attr('id');
  switch (arrow_id) {
    case 'first':
      CURRENT_PAGE = 1;
      break;
    case 'prev':
      if (CURRENT_PAGE > 1) {
        CURRENT_PAGE = CURRENT_PAGE - 1;
      } else {
        CURRENT_PAGE = 1;
      }
      break;
    case 'next':
      if (CURRENT_PAGE < PAGE_NUMBER) {
        CURRENT_PAGE = CURRENT_PAGE + 1;
      } else {
        CURRENT_PAGE = PAGE_NUMBER;
      }
      break;
    case 'last':
      CURRENT_PAGE = PAGE_NUMBER;
  }
  Show();
}

// show current page
function Show() {
  var checked_state = false,
    count = 0;
  PAGE_NUMBER = PageNumFinder();
  // Add link
  if (QUANTITY_SHOW === 0 && (CURRENT_PAGE > 1)) {
    CURRENT_PAGE--;
  }
  // delete old links
  $('.page-links-list a').remove();
  $('li').remove();
  if (PAGE_NUMBER > 1) {
    for (var i = 0; i < PAGE_NUMBER; i++) {
      // create hlinks
      $('.page-links-list').append('<a href="#" class="page-links">' + (i + 1) + '</a>');
    }
  }
  QUANTITY_SHOW = 0;

  tasks.forEach(function (task) {
    switch (STATE) {
      case 'all':
        checked_state = task.done;
        break;
      case 'active':
        checked_state = false;
        break;
      case 'completed':
        checked_state = true;
    }
    if (task.done === checked_state) {
      if (count >= (CURRENT_PAGE - 1) * PAGE_LENGTH && count < CURRENT_PAGE * PAGE_LENGTH) {
        $("<li/>", {
          "class": "new-task",
          id: task.id
        }).appendTo('.todo-list')
          .append(
            $("<input/>", {
              "class": "cb",
              type: "checkbox",
              checked: checked_state
            }),
            $("<label/>", {
              "class": "label-task",
              text: task.name
            }),
            $("<button/>", {
              "class": "destroy",
              text: "x"
            }));
        QUANTITY_SHOW++;
      }
      count++;
    }
  });
  // show/hide arrows links
  $('.hidden-bl').toggleClass("hidden-bl");
  if (PAGE_NUMBER === 1) {
    $('.border-links').toggleClass("hidden-bl");
  }
  // make large font for active numeric link
  var b = $('.page-links').get(CURRENT_PAGE - 1);
  $(b).toggleClass('page-links-lrg');
}

// calc PAGE_NUMBER by STATE
function PageNumFinder() {
  var a;
  switch (STATE) {
    case 'all':
      a = Math.ceil($(tasks).length / PAGE_LENGTH);
      break;
    case 'active':
      var b = 0;
      tasks.forEach(function (task) {
        if (task.done === false) {
          b++;
        }
      });
      a = Math.ceil(b / PAGE_LENGTH);
      break;
    case 'completed':
      var c = 0;
      tasks.forEach(function (task) {
        if (task.done === true) {
          c++;
        }
      });
      a = Math.ceil(c / PAGE_LENGTH);
  }
  return a;
}

function Logging() {
  var a = JSON.stringify(tasks);
  console.log(tasks);
  console.log(a);
    //db.tasks.insert(a);
    //db.tasks.find()
    //console.log('OK');
}

function GetRequest() {
  $.ajax({
    type: "GET",
    url: "/todos",
    success: function (data) {
      tasks = [];
      data.forEach((obj) => {
        var task = {
          name: obj.name,
          id: obj._id,
          done: obj.done,
        };
        tasks.push(task);
      });
      Counters();
    },
  });
}

function PostRequest(task){
  $.ajax({
    type: "POST",
    url: "/todos",
    data: JSON.stringify(task),
    dataType: "json",
    contentType: "application/json",
    success: function(data){
          var task = {
            name: data.name,
            id: data._id,
            done: data.done,
          };
          tasks.push(task);
      Counters();
    },
  });
}

function checkPatchRequest(Id){

  var taskIndex = tasks.findIndex( (task) => {if (task.id == Id) return task});
  var done = tasks[taskIndex].done ? false : true;

  $.ajax({
    type: "PATCH",
    url: "/todos/" + tasks[taskIndex].id + '&' + done,
    dataType: "json",
    success: function(data){
      GetRequest();
    },
  });
}

function DeleteRequest(Id){
  $.ajax({
    type: "DELETE",
    url: "/todos/" + Id,
    success: function(){
      GetRequest();
    },
  });
}


function DoneDeleteRequest(){
  $.ajax({
    type: "DELETE",
    url: "/todos",
    success: function(){
      GetRequest();
    },
  });
}
