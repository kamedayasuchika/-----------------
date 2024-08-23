let today = new Date(); //今日の日付
const week = ["日","月","火","水","木","金","土"]; //曜日
var year; //年
var month; //月
var plan; //予定
var place; //場所
var time_h; //～時
var time_m; //～分
var year_month; //-年‐月
var hour; //時間
var minutes; //秒
var taskText; //予定、場所、日付、時間
var Storageday; //登録ボタンを押下した際の日付


//画面が読み込まれた際に、読み込まれた処理
    window.onload = function(){
    //カレンダーのヘッダー部分の作成
    Calendarheader(today);
    //カレンダーの日付部分の作成
    CalendarTable();
    //-年‐月の作成
    year_month_create();
     // ローカルストレージから保存された情報を取得し、存在しなければ空の配列を作成
     const saveTasks = JSON.parse(localStorage.getItem(("tasks" + year_month))) || [];
    // 保存された情報に対して処理を行う
    saveTasks.forEach(function (taskText) {
        // タスクを表示する関数を呼び出す
        createTask(taskText);
      });
     };

//カレンダーの～年～月の部分を作成
    function Calendarheader(today){
        year = today.getFullYear();
        month = today.getMonth() + 1;
        if(month < 10){
            month = "0" + month;
        }
        var header = year + "年" + month + "月";
        document.getElementById("Header_year_month").textContent = header;
    }


//カレンダーの日付の部分を作成
    function CalendarTable(){
        const table = document.createElement("table"); //table要素の作成
        table.id = "calendartable";
        const thead = document.createElement("thead"); //thead要素の作成
        const thead_tr = document.createElement("tr"); //tr要素の作成
        for(let i = 0; i < week.length; i++){  //曜日列の作成
            const thead_th = document.createElement("th"); //td要素の作成
            const textweek = document.createTextNode(week[i]); 
            thead_th.appendChild(textweek);
            thead_tr.appendChild(thead_th);
        }
        thead.appendChild(thead_tr);
        table.appendChild(thead);

        year = today.getFullYear();
        month = today.getMonth();

        var startDayOfWeek = new Date(year, month, 1).getDay(); //月初の曜日を取得
        var monthOfEndDay = new Date(year, month + 1, 0).getDate(); //月末日を取得
        var countDay = 0; //日にち
        const plus_seven = 7; //7日
        var countDay_plus_seven; //日にち+7日(23/30 ←　5週目表示用)
        const lastWeek = 4; //最終週
        var textday; //　td内に表示されるテキスト
    

    const tbody = document.createElement("tbody"); ////tbody要素の作成
    tbody.id = "calendartbody";
    for(let t = 0; t < 5; t++){
        const tbody_tr = document.createElement("tr"); //tr要素の作成
        for(let j = 0; j < week.length; j++){
            const tbody_td = document.createElement("td"); //td要素の作成
            tbody_td.classList.add("in_data");
            if((t == 0 && j < startDayOfWeek) || (t == 4  && countDay == monthOfEndDay)){ //月初前、月末後に空白の枠作成
                tbody_td.classList.replace("in_data","no_data");
                textday = document.createTextNode("　"); //予定がない日は空白を入れる
            }else if(t == 0 && startDayOfWeek == j){  //1週目の作成
                countDay++; //日付
                textday = document.createTextNode(countDay); 
            }else if(t < lastWeek){  //2~4週目の作成
                countDay++; //日付
                textday = document.createTextNode(countDay);
            }else if(t == lastWeek && startDayOfWeek >= 5 && monthOfEndDay == "31" && countDay_plus_seven < monthOfEndDay){  //最終週、月初が金、土で始まり、月末が31日、日付+7日が月末未満
                countDay++; //日付
                textday = document.createTextNode(countDay + "/" + (countDay_plus_seven + 1));
            }else if(t == lastWeek && startDayOfWeek == 6 && monthOfEndDay == "30" && countDay_plus_seven <= monthOfEndDay){ //最終週、月初が土で始まり、月末が30日、日付+7日が月末未満
                countDay++; //日付
                textday = document.createTextNode(countDay + "/" + countDay_plus_seven);
            }else if(t == lastWeek){ //最終週で、上2つ以外の場合
                countDay++; //日付
                textday = document.createTextNode(countDay);
            }
            tbody_td.appendChild(textday);
            tbody_tr.appendChild(tbody_td);
            tbody.appendChild(tbody_tr);
            countDay_plus_seven = countDay + plus_seven;
        }
        table.appendChild(tbody);
        const calender = document.getElementById("calendar");
        calender.appendChild(table); 
    }
}


//年、月のボタンが押されるたびに表示されているカレンダーを削除し、変更後の年、月で再度カレンダーを作成
function removeCalendar(){
    var calendartable = document.getElementById("calendar");
    while(calendartable.firstChild){
        calendartable.removeChild(calendartable.firstChild);
    }  
    CalendarTable();
}

//去年のカレンダーを表示
function last_year(){
    today.setFullYear(today.getFullYear() - 1);
    removeCalendar();
    Calendarheader(today);
    year_month_create();
    removelist();
}

//来年のカレンダーを表示
function next_year(){
    today.setFullYear(today.getFullYear() + 1);
    removeCalendar();
    Calendarheader(today);
    year_month_create();
    removelist();
}

//先月のカレンダーを表示
function last_month(){
    today.setMonth(today.getMonth() - 1);
    removeCalendar();
    Calendarheader(today); 
    year_month_create();
    removelist();
}

//来月のカレンダーを表示
function next_month(){
    today.setMonth(today.getMonth() + 1,1);
    removeCalendar();
    Calendarheader(today);
    year_month_create();
    removelist();
}

//今日の月のカレンダーを表示
function reset_year_month(){
    today = new Date();
    removeCalendar();
    Calendarheader(today);
    year_month_create();
    removelist();
}


//ここから予定フォーム、ローカルストレージについての記述


// タスクを表示する関数
function createTask(saveTasks_last) {
    // タスクリストの要素を取得
    const taskList = document.getElementById("task-list");
    // 新しいタスクを作成
    const taskItem = document.createElement("li");
    // 作成したタスクにテキストを設定
    taskItem.textContent = saveTasks_last;

    // 削除ボタンを作成
    const deleteButton = document.createElement("button");
    //削除ボタンにID付与
    deleteButton.id = "deletButton";
    // 削除ボタンのテキストを設定
    deleteButton.textContent = "削除";
    // 削除ボタンがクリックされたときの処理を設定
    deleteButton.addEventListener("click", function () {
        // タスクを削除する関数を呼び出す
        deleteTask(saveTasks_last);
        // タスクをタスクリストから削除
        taskList.removeChild(taskItem);
    });
  
    // 削除ボタンをタスクに追加
    taskItem.appendChild(deleteButton);
    // タスクをタスクリストに追加
    taskList.appendChild(taskItem);
}
 
    // タスクをローカルストレージに保存する関数
    function saveTask(taskText ,year_month) {
        // ローカルストレージから保存されたタスクを取得し、存在しなければ空の配列を作成
        const saveTasks = JSON.parse(localStorage.getItem(("tasks" + year_month))) || [];
        // 新しいタスクを保存されたタスクリストに追加
        saveTasks.push(taskText);
        // タスクリストをローカルストレージに保存
        localStorage.setItem("tasks" + Storageday, JSON.stringify(saveTasks));
    }

    // タスクを削除する関数
    function deleteTask(saveTasks_last) {
        const saveTasks = JSON.parse(localStorage.getItem(("tasks" + year_month))) || [];
        // 指定されたタスクをフィルタリングして削除
        const updatedTasks = saveTasks.filter(function (task) {
          return task != saveTasks_last;
        });
        // 更新されたタスクリストをローカルストレージに保存
        localStorage.setItem(("tasks" + year_month), JSON.stringify(updatedTasks));
    }

    //登録ボタンが押下された際に走る関数
    function submit(){
        let plan = document.getElementById("plan").value; //予定フォームの値
        let place = document.getElementById("place").value; //場所フォームの値
        let day = document.getElementById("day").value; //日付フォームの値
        let time_h = document.getElementById("time_h").value; //～時フォームの値
        let time_m = document.getElementById("time_m").value; //～分フォームの値
        
        //2024-08-01の形式から2024-08の形に成形
        Storageday = String(day).slice(0 , -3);
    
        //各フォームの値を予定、場所、日付、時間の形に成形
        taskText =  
          "予定:　" + plan + "　" +
          "場所:　" + place + "　" +
          "日付:　" + day + "　" +
          "時間:　" + time_h + ":" + time_m;
    
        //全てのフォームに入力があった際に関数を呼び出す
        if(plan && place && day && time_h && time_m && year_month == Storageday){
            // タスクを保存する関数を呼び出す
            saveTask(taskText , Storageday);
            // 入力フィールドをクリア
            document.getElementById("plan").value = "";
            document.getElementById("place").value= "";
            document.getElementById("day").value= "";
            document.getElementById("time_h").value= "";
            document.getElementById("time_m").value= "";
          }else if(plan == "" || place == "" || day == "" || time_h == "" || time_m == "" ){
            var result = window.confirm("予定を登録する際は、全て情報を入力してください。");
          }else if(year_month != Storageday){
            var result = window.confirm("予定を登録する際は、今月の情報を入力してください。");
          }
    }
    
    //フォームに一番最後に入力された情報を表示する
    function display(){
        if(taskText){
            createTask(taskText);
        }
        taskText = "";
    }

    //ローカルストレージに保存されている情報を全て削除
    function remove(){
        if(JSON.parse(localStorage.getItem(("tasks" + year_month)))){
            var result = window.confirm("登録した予定が消えてしまいます！");
            if(result){
                localStorage.removeItem(("tasks" + year_month));
                removelist();
            
        }
        }
    }

    function removelist(){
        var taskList = document.getElementById("task-list");
        while(taskList.firstChild){
            taskList.removeChild(taskList.firstChild);
        }
    }

    //～時フォームのプルダウンリストの作成
    function create_h(){
        var all_h = [];
        for(h = 0; h < 24; h++){
            let time_h = document.getElementById("time_h");
            if(h < 10){
                hour = "0" + h;
                all_h.push(hour);
            }else{
                hour = String(h);
                all_h.push(hour);
            }
            let option = document.createElement("option");
            option.text = all_h[h];
            time_h.appendChild(option); 
        }
    }

    //～分フォームのプルダウンリストの作成
    function create_m(){
        var all_m = [];
        for(m = 0; m < 60; m++){
            let time_m = document.getElementById("time_m");
            if(m < 10){
                minutes = "0" + m;
                all_m.push(minutes);
            }else{
                minutes = String(m);
                all_m.push(minutes);
            }
            let option = document.createElement("option");
            option.text = all_m[m];
            time_m.appendChild(option); 
        }
    }

    function year_month_create(){
        if((month + 1) < 10){
            month = "0" + (month + 1);
            year_month = String(year) + "-" + month; 
        }else{
            year_month = String(year) + "-" + month;   
        }
    }

    async function getHolidaysOf(year) {
        const url = `https://holidays-jp.github.io/api/v1/date.json?year=${year}`;
        const response = await fetch(url);
        const holidays = await response.json();
        return holidays;
      }
      
      (async () => {
        const holidays2024 = await getHolidaysOf(2024);
        console.log(holidays2024);
      })();