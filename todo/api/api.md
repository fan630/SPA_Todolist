## API 文件

Base URL: fan630.com.tw/todo/api/api.php

| 說明     | Method | 路徑      | 參數                   | 範例             |
|--------|--------|------------|----------------------|----------------|
| 獲取所有todo | GET    | /     |   無         |      |
| 獲取單一todo | GET    | /:id  |                     |       
| 新增todo   | POST   | /     | content:內容 |               
| 刪除todo   | DELETE   | ?id     | id              
| 修改todo   | PATCH   | /:id     |  revise:內容 state:0(未完成) state:1(已完成) |               


- 新增  

curl -X POST  http://localhost:8080/todo/api/api.php -d "content=homework"

---
- 讀取  

curl -X GET http://localhost:8080/todo/api/api.php

---
- 讀取id為630的todo  

curl -X GET http://localhost:8080/todo/api/api.php/630

---
- 刪除id為631  

curl -X DELETE http://localhost:8080/todo/api/api.php/631

---

- 修改todo  

curl -X PATCH http://localhost:8080/todo/api/api.php?id=624 -d "revise=222&state=1" 

---