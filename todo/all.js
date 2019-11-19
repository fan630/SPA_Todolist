// 全域

const baseUrl = './api/api.php';
// const baseUrl = 'fan630.com.tw/todo/api/api.php';

const time = () => {
  const d = new Date();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const output = `${+d.getFullYear()} /${month < 10 ? '0' : ''}${month} /${
    day < 10 ? '0' : ''}${day}`;

  $('#current-time').html(output);
};

time();

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
