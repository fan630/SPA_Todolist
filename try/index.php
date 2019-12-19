<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.9.0/css/all.min.css">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css"
        integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
    <link rel="stylesheet" href="./hw3.css">
    <script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
    <title>Week19_hw2</title>
</head>

<body>
    <div class="container">
        <div class="wrapper">
            <div class="title">
                To Do List
                <span class=".bar"></span>
            </div>

            <div class="section">
                <input type="text"  name="dataInput" placeholder="請輸入待辦事項" class="text" value="" />
                <button type="button" class="send btn btn-outline-primary" data-toggle="button">提交</button>
            </div>

            
            <ul class="list__group">

                </ul>
            
        </div>
    </div>
</body>

<script>

$(document).ready(() => {
  $("span[class$='.bar']").addClass('fas fa-list alt')
  $('.list__group').on('click', '.delete', deleteItem)

render()

function render(){
  const baseUrl = './api/api.php';

    $.ajax({
        type:"GET",
        url: baseUrl
    })

    .done(function(resp){
        if(resp !== 0){
            const req = JSON.parse(resp)
            $('.text').val('')
            $('.list__group').empty()
            for (let i = 0; i < req.length; i += 1) {
                if(req[i].status == 0){
                    $('.list__group').append(
                        `<li data-id=${req[i].id} class="d-flex underline">
                                <div class="form-check mr-auto">
                                    <input type='checkbox' class='status'>
                                    <span>${req[i].todo}</span>
                                    <input class="task_input"/>
                                </div>
                            <button class='btn-edit'>EDIT</button>
                            <button class='delete' >Delete</button>
                            </li>`
                        )
                }else{
                    $('.list__group').append(
                            `<li data-id=${req[i].id} class="d-flex" checked>
                                <div class="form-check" >
                                    <input type='checkbox' class='status' ml-1>
                                    <span>${req[i].todo}</span>
                                    <input class="task_input"/>
                                </div>
                                <button class='btn-edit'>EDIT</button>
                                <button class='delete' >Delete</button>
                                </li>`
                            )
                    }
            }
        }else{
            return
        } 
    })
    .fail(function(resp){
        console.log(resp)
    })
}

// 新增留言
$('.send').on('click', (e) => {
    if ($('.text').val() !== '') {

    const status = 0//沒完成
    const dataInput =$(e.target).parent().find('input[name="dataInput"]').val()
    //console.log(done, dataInput)
    const baseUrl = './api/api.php';

    $('.text').val('')
        $.ajax({
        type: 'POST',
        url: baseUrl,
        data:
            { 
                dataInput: dataInput,
                status: status
            }
        })

        .done(function(resp) {
                const res = JSON.parse(resp)
                if(res.result === "success"){
                render()
            }
        })
        
        .fail(function(resp) {
                console.log(resp)
            })

    }else{
        alert('請先輸入資料!')
    }
})


//刪除留言
function deleteItem(e){
    //if(!confirm("是否要刪除?")) return
    const id = $(e.target).parent().attr('data-id')
    const baseUrl = './api/api.php';

    $.ajax({
            type: 'DELETE',
            url: `${baseUrl}?id=${id}`
        })
        .done(function(resp) {
            $(e.target).closest('li').remove()
            render()

        }).fail(function(resp){
            console.log(resp)
        })
}

// 項目完成狀態
$('.list__group').on('change', '.status', (e) => {
      const element = $(e.target);
      const id = $(e.target).closest('li').attr('data-id');
      if (element.prop('checked')) {
        const newStatus = 1;
        editStatus(id, newStatus);
      } else {
        const newStatus = 0;
        editStatus(id, newStatus);
      }
})

//更改留言
$('.list__group').on('click', '.btn-edit', (e) => {
      const element = $(e.target).closest('li')
      const id = element.attr('data-id')
      //const taskOuter = e.target.closest('li').querySelector('span')
      //const taskContent = taskOuter.innerText
      const taskContent = element.find('span').html()
    //   console.log(taskContent === taskContent)
      
      const taskInput = element.find('.task_input')
      //console.log(taskOuter, taskContent, taskInput)

      if(element.hasClass('edit')){
            element.removeClass('edit')
            const newDataInput = taskInput.val()
            editTodo(id, newDataInput)
      }else{
           element.addClass('edit')
           taskInput.val(taskContent)
      }
})


//更新status,目前是成功的
function editStatus(id, newStatus) {
  const baseUrl = './api/api.php';

  $.ajax({
    type: 'PATCH',
    url: `${baseUrl}?id=${id}`,
    data: {
       newStatus: newStatus
    },
    success: () => {
      render();
    },
    error: (response) => {
      alert(JSON.parse(response).result);
    },
  });
}

//更新todo
function editTodo(id, newDataInput) {
  const baseUrl = './api/api.php'; 
  //const newDataInput =$(e.target).parent().find('input[name="dataInput"]').val()
  
  $.ajax({
    type: 'PATCH',
    url: `${baseUrl}?id=${id}`,
    data: {
      newDataInput: newDataInput// 就是我的dataInput
    },
    success: () => {
      render();
    },
    error: (response) => {
      alert(JSON.parse(response).result);
    },
  });
}



})


    
    </script>
</html>