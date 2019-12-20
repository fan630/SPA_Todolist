// 全域

const baseUrl = './api/api.php';
// const baseUrl = 'fan630.com.tw/todo/api/api.php';

const time = function () {
  const d = new Date();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const output = `${+d.getFullYear()} /${month < 10 ? '0' : ''}${month} /${
    day < 10 ? '0' : ''}${day}`;

  $('#current-time').html(output);
}();

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// 輸出所有留言
function render() {
  $.ajax({
    type: 'GET',
    url: baseUrl,
  })

    .done((resp) => {
      const list = JSON.parse(resp);
      // console.log(list) //{id: 423, todo: "", state: 0}, 陣列裡面有物件
      if (list !== 0) {
        $('.text').val('');
        $('.list__group').empty();
        $('.list__group').append(
          list.map(({ id, todo, state }) => `<li data-id= ${id} class= "d-flex list__group__item ${Number(state) ? 'active' : ''} " >
                                <div class="form__check mr-auto">
                                    <input type="checkbox" class="form__check__input" ${Number(state) ? 'checked' : ''}>
                                        <span class="content">${escapeHtml(todo)}</span>
                                    <input class="task_input"/>
                                </div>
                                <div class="action">
                                  <i class="far fa-edit btn-edit"></i>
                                  <i class="far fa-trash-alt delete"></i>
                                </div>
                            </li>`),
        );
        //const lists = Array.from(document.querySelectorAll('.list__group__item'))
        //lists.forEach(list => list.addEventListener('click', handleClick))

        //let firstCheck = null

        //function handleClick(e){
          //if(!this.classList.contains('active')){
            //firstCheck = lists.indexOf(this)
             //console.log(firstCheck)
             //if(e.shiftKey && firstCheck !== null){
                 //let secondCheck = lists.indexOf(this)
               //console.log(firstCheck, secondCheck)
               //console.log(firstCheck)
               //console.log(secondCheck)

              //  lists.slice(
              //     Math.min(firstCheck, secondCheck), 
              //     Math.max(firstCheck, secondCheck)
              //  ).forEach(input => (input.classList.add('active')))
             //}
            //console.log(firstCheck)// 這可以標示出來
          //}else{
            //firstCheck = null
          //}
        //}


      } else {
        alert('請輸入內容!');
      }
    })
    .fail((resp) => {
      console.log(resp);
    });
}

// 更新status
function editStatus(id, newStatus) {
  $.ajax({
    type: 'PATCH',
    url: `${baseUrl}/${id}`,
    data: {
      state: newStatus,
    },
    success: () => {
      render();
    },
    error: (response) => {
      alert(JSON.parse(response).result);
    },
  });
}

// 更新todo
function editTodo(id, newDataInput) {
// const newDataInput =$(e.target).parent().find('input[name="dataInput"]').val()

  $.ajax({
    type: 'PATCH',
    url: `${baseUrl}/${id}`,
    data: {
      revise: newDataInput,
    },
    success: () => {
      render();
    },
    error: (response) => {
      alert(JSON.parse(response).result);
    },
  });
}

// 新增留言
function createTodo() {
  const dataInput = $('.text').val();
  $.ajax({
    type: 'POST',
    url: baseUrl,
    data:
    {
      content: dataInput,
    },
  })

    .done((resp) => {
      const res = JSON.parse(resp);
      if (res.result === 'success') {
        render();
      }
    })

    .fail((resp) => {
      console.log(resp);
    });
}

// 刪除todo
function deleteItem(e) {
  if(!confirm("是否要刪除?")) return
  const id = $(e.target).parent().parent().attr('data-id');

  $.ajax({
    type: 'DELETE',
    url: `${baseUrl}/${id}`,
  })
    .done((resp) => {
      $(e.target).closest('li').remove();
    }).fail((resp) => {
       alert('fail!')
    });
}


$(document).ready(() => {
  $("span[class$='.bar']").addClass('fas fa-list alt');
  // $(".send").addClass('fa fa-pencil-square-o')
  render()
  // 新增留言
  $('.send').click(() => {
    if ($('.text').val() !== '') {
      createTodo();
    } else {
      alert('請先輸入資料!');
    }
  });

  // 新增留言keydown
  $('.text').keydown((e) => {
    const dataInputkey = $('.text').val();

    if (dataInputkey.length === 0) return;

    if (e.keyCode === 13) {
      $('.text').val('');
      $.ajax({
        type: 'POST',
        url: baseUrl,
        data:
              {
                content: dataInputkey,
              },
      })

        .done((resp) => {
          const res = JSON.parse(resp);
          if (res.result === 'success') {
            render();
          }
        })

        .fail((resp) => {
          alert('請先輸入資料!')
        });
    } else {
      null;
    }
  });

  // 更改狀態
  $('.list__group').on('change', '.form__check__input', (e) => {
    const element = $(e.target);
    const id = $(e.target).closest('li').attr('data-id');
    if (element.prop('checked')) {
      const newStatus = 1;
      editStatus(id, newStatus);
    } else {
      const newStatus = 0;
      editStatus(id, newStatus);
    }
  });

  // 更改留言
  $('.list__group').on('click', '.btn-edit', (e) => {
    const element = $(e.target).closest('li');
    const id = element.attr('data-id');
    // 舊的內容
    const taskContent = element.find('span').html();
    const taskInput = element.find('.task_input');
    const dataInput = taskInput.val();
    // console.log(taskOuter, taskContent, taskInput)
    // console.log(revise)
    if (element.hasClass('edit')) {
      if (dataInput.length === 0) return;
      element.removeClass('edit');
      editTodo(id, dataInput);
    } else {
      element.addClass('edit');
      element.find('span').hide();
      taskInput.val(taskContent);
    }
  });

  // 更改留言keydown事件

  $('.list__group').on('keydown', '.task_input', (e) => {
    const element = $(e.target).closest('li');
    const taskInput = element.find('.task_input');
    const id = element.attr('data-id');
    const newDataInput = taskInput.val();

    if (e.keyCode === 13) {
      if (newDataInput.length === 0) return;
      editTodo(id, newDataInput);
    } else {
      null;
    }
  });

  // 刪除留言
  $('.list__group').on('click', '.delete', deleteItem);
});

// JS


const APPID = '79c644e3ee78cc550e597d1cbf4b5e08'
const cityID = '1668341'
const url = `https://api.openweathermap.org/data/2.5/weather?id=${cityID}&APPID=${APPID}`

// let weatherData = []

// fetch(url)
//   .then(res => res.json())
//   .then(data => (weatherData = data))

//串天氣api
const request = new XMLHttpRequest()
request.onload = function(){
  if(request.status >= 200 && request.status < 400){    const weatherData = JSON.parse(request.responseText)
    console.log(weatherData)
    const weather = document.querySelector('.weather')


    function sunTime(x){
      var date = new Date( x* 1000);
      // Hours part from the timestamp
      var hours = date.getHours();
      // Minutes part from the timestamp
      var minutes = "0" + date.getMinutes();
      // Seconds part from the timestamp
      var seconds = "0" + date.getSeconds();

      // Will display time in 10:30:23 format
      return formattedTime = hours + ':' + minutes.substr(-2)
    }

    function situation(y){
       if(y.indexOf('oud') >=0){
         document.body.style.backgroundColor = '#F5F5F5'
         return '<i class="fas fa-cloud-sun"></i>'
       } else if (y.indexOf('un') >= 0){
         document.body.style.backgroundColor = '#E6B800'
         return '<i class="far fa-sun"></i>'
       } else if (y.indexOf('zzl') >= 0) {
         document.body.style.backgroundColor = 'Lightblue'
         return '<i class="fas fa-cloud-rain"></i>'
       } else if (y.indexOf('ai') >= 0){
         document.body.style.backgroundColor = '#00BBFF'
         return '<i class="fas fa-cloud-rain"></i>'
       }
    }
   
    weather.innerHTML = `
              <div class="location">${weatherData.name}</div>
              <div id="current-time" class="mb-1"></div>
              <div class="desc">天氣概況  ${situation(weatherData.weather[0].main)}</div>
              <div class="temp">溫度 ${Math.round((weatherData.main.temp - 273.15))}&deg;C</div>
              <div class="feellike">體感溫度 ${Math.round((weatherData.main.feels_like - 273.15))}&deg;C</div>
              <div class="sunrise">日出時間 ${sunTime(weatherData.sys.sunrise)}</div>
              <div class="sunrise">日落時間 ${sunTime(weatherData.sys.sunset)}</div>
    `
  }
}

//測試天氣...
// <div class="desc">天氣概況 ${situation('sun')}</div>

request.open('GET', url, true)
request.send()








