// 開始定義的資料結構如下
// const dataList = [ { todo: '輸入的資料', isCheck: false, isEdit: false} ]

const dataList = []

function render () {
  $('.text').val('')
  $('.list').empty()
  const len = dataList.length
  for (let i = 0; i < len; i += 1) {
    if (dataList[i].isCheck === false) {
      $('.list').append(
        `<li data-num=${i} class="d-flex">
            <input type='checkbox' class='done '>
                <div class="mr-auto">
                  ${dataList[i].todo}
                </div>
            <button class='edit'>EDIT</button>
            <button class='delete' >Delete</button>
            </li>`
      )
    } else {
      $('.list').append(
        `<li data-num=${i} class="checked d-flex">
            <input type='checkbox' class='done' checked>
                <div class="mr-auto">
                  ${dataList[i].todo}
                </div>
            <button class='edit' >EDIT</button>
            <button class='delete' >Delete</button>
            </li>`
      )
    }
  }
}
//怎麼傳球
// const dataList = [ { todo: '輸入的資料', isCheck: false, isEdit: false} ]

// $('.send').on('click', () => {
//   if ($('.text').val() !== '') {
//     const dataInput = $('.text')[0].value

//     $.ajax({
//       method: 'POST',
//       url: './create.php',
//       dataList:
//         { 
//           todo: dataInput,
//           is_Check: false
//         }
//     })
//       .done(function (resp) {
//         //這就是後面傳來的東西,把整組array稱呼為response. 
//         const res = JSON.parse(resp)
//         if(res.result === "success"){
//           $('.list').append(
//             `<li data-id=${res.id} class="d-flex">
//             <input type='checkbox' class='done '>
//                 <div class="mr-auto">
//                   ${dataList.todo}
//                 </div>
//             <button class='edit'>EDIT</button>
//             <button class='delete' >Delete</button>
//             </li>`
//           )
//         }

//       }).fail(function (response) {
//         const msg = JSON.parse(response)
//         alert(msg.message)
//       })
//     //render()
//   }else{
//     alert('請先輸入資料!')
//   }
// })

$('.send').on('click', () => {
  if ($('.text').val() !== '') {
    const dataInput = $('.text')[0].value

    $.ajax({
      method: 'POST',
      url: 'https://reqres.in/api/users',
      dataList:
      {
        "name": "morpheus",
        "job": "leader"
      }
    })
      .done(function (resp) {
        //這就是後面傳來的東西,把整組array稱呼為response. 
        if (resp.result === "success") {
          $('.list').append(
            `<li data-id=${res.id} class="d-flex">
            <input type='checkbox' class='done '>
                <div class="mr-auto">
                  ${dataList.todo}
                </div>
            <button class='edit'>EDIT</button>
            <button class='delete' >Delete</button>
            </li>`
          )
        }

      }).fail(function (response) {
        const msg = JSON.parse(response)
        alert(msg.message)
      })
    //render()
  } else {
    alert('請先輸入資料!')
  }
})



    //dataList.push({ todo: dataInput, isCheck: false , isEdit: false})


function deleteItem (e) {
  const num = $(e.target).closest('li').attr('data-num')
  dataList.splice(num, 1)
  render()
}

function finished (e) {
  const num = $(e.target).closest('li').attr('data-num')
  if ($(e.target).prop('checked')) {
    dataList[num].isCheck = true
  } else {
    dataList[num].isCheck = false
  }
  render()
}

function editItem(e){
    const num = $(e.target).closest('li').attr('data-num')
    dataList[num].todo = ''
    dataList[num].isEdit = true
    render()
  }

$(document).ready(() => {
  $("span[class$='.bar']").addClass('fas fa-list alt')
  $('.list').on('click', '.delete', deleteItem)
  $('.list').on('change', '.done', finished)
  $('.list').on('click', '.edit', editItem)
})
