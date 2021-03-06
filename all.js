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
          list.map(({ id, todo, state }) => `<li data-id= ${id} class= "d-flex list__group__item list-group-item list-group-item-action ${Number(state) ? 'active' : ''} " >
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

;(function(){
  const APPID = '79c644e3ee78cc550e597d1cbf4b5e08'
  const cityID = '1668341'
  const url = `https://api.openweathermap.org/data/2.5/weather?id=${cityID}&APPID=${APPID}`

  //串天氣api
  const request = new XMLHttpRequest()
  request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
      const weatherData = JSON.parse(request.responseText)
      console.log(weatherData)
      const weather = document.querySelector('.weather')


      function sunTime(x) {
        var date = new Date(x * 1000);
        // Hours part from the timestamp
        var hours = date.getHours();
        // Minutes part from the timestamp
        var minutes = "0" + date.getMinutes();
        // Seconds part from the timestamp
        var seconds = "0" + date.getSeconds();

        // Will display time in 10:30:23 format
        return formattedTime = hours + ':' + minutes.substr(-2)
      }

      function situation(y) {
        let message = ""
        switch (y) {
          case 'Clouds':
            document.body.style.backgroundColor = '#ECFFFF'
            return message = "多雲"
            break;
          case 'Drizzle':
            document.body.style.backgroundColor = '#c3c3c3'
            return message = "毛毛雨"
            break;
          case 'Thunderstorm':
            document.body.style.backgroundColor = '#6C6C6C'
            return message = "雷陣雨"
            break;
          case 'Rain':
            document.body.style.backgroundColor = '#00CACA'
            return message = "雨一直下"
            break;
          case 'Clear':
            document.body.style.backgroundColor = '#FFFFAA'
            return message = "情朗的天空"
            break;
          case 'Snow':
            document.body.style.backgroundColor = '#FFFCEC'
            return message = "雪"
            break;
          default:
            document.body.style.backgroundColor = '#fff'
            break;
        }
      }


      weather.innerHTML = `
              <div class="card text-center">
                <div class="card-header font-weight-bold">
                   <strong>${weatherData.name}</strong>
                </div>
                <div>
                   <img src="http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png" class="img-fluid">
                </div>
                <button
                    class="btn btn-light btn-block"
                    type="button"
                    data-toggle="collapse"
                    data-target="#collapseExample"
                    aria-expanded="false"
                    aria-controls="collapseExample"
                >
                    <i class="fas fa-arrow-down"></i>
                </button>
                <div
                    class="collapse"
                    id="collapseExample"
                >
                  <ul class="list-group list-group-flush">
                        <li class="list-group-item">${situation(weatherData.weather[0].main)} </li>
                        <li class="list-group-item">${Math.round((weatherData.main.temp - 273.15))}&deg;C</li>
                        <li class="list-group-item">${Math.round((weatherData.main.feels_like - 273.15))}&deg;C (體感溫度)</li>
                        <li class="list-group-item">${sunTime(weatherData.sys.sunrise)} (日出時間)</li>
                        <li class="list-group-item">${sunTime(weatherData.sys.sunset)} (日落時間)</li>
                    </ul>
                </div>
              </div>
              `
    }
  }
  request.open('GET', url, true)
  request.send()
})()










