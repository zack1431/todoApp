
/**
 * api endpoint
 */
 const url = "https://62f9d77dffd7197707e0e276.mockapi.io/tasks";

//  window size
 var w = window.innerWidth;
 var h = window.innerHeight;
 /**
  * get task list api
  */
 async function getTaskList(){
    let response = await fetch(url, {
                  method: 'GET',
                  mode: 'cors',
                  headers: {
                    'Access-Control-Allow-Origin':'*',
                    'Content-Type': 'application/json',
                  }})
    
      let allTasks = await response.json();
      return allTasks;
  }
/**
  * post task  api
  */
  async function addTaskList(obj){
    var reqObj = {
        name:obj.name,
        status:obj.status
    }
    reqObj = JSON.stringify(reqObj)
    const postTask = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin':'*',
          'Content-Type': 'application/json',
        },body:reqObj})
    return await postTask.json(); 
  }

  /**
  * delete task  api
  */
  async function deleteTask(id){
    const postTask = await fetch(url+'/'+id, {
        method: 'DELETE',
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin':'*',
          'Content-Type': 'application/json',
        }})
    return await postTask.json(); 
  }

  /**
   * update task status
   */
  async function updateTask(obj){
    var reqObj = JSON.stringify(obj);
    const postTask = await fetch(url+'/'+obj.id, {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin':'*',
          'Content-Type': 'application/json',
        },body:reqObj})
    return await postTask.json(); 
  }

/*
background image var
*/
var headerImg;
var timeIcon;
var hours = new Date().getHours()
var isDayTime = hours > 6 && hours < 20
function loadDefault(){
    headerImg = document.getElementById('headerImg');
    timeIcon = document.getElementById('dayNightIcon');
    let taskInput = document.getElementsByClassName('no-dark');
    let filterList = document.getElementsByClassName('filter-list')
    let taskList = document.getElementById('taskList');
    let activeFill = document.getElementById('activeFill');
    let completeFill = document.getElementById('completeFill')
    let totalTask = document.getElementById('totalTasks');
    let bodyBg = document.getElementById('bodyBg');
    totalTask.innerHTML = addPoint.length + ' items left';
    let filters = document.getElementsByClassName('filters')
    let mobfilter = document.getElementsByClassName('mob-filter')

    // filter toggle for moile/desktop
    
    // get hour of the day
    if(isDayTime)
    {
        headerImg.style.backgroundImage = "url('./images/bg-desktop-light.jpg')"
        /*
        day night icon var
        */
        timeIcon.setAttribute('src','./images/icon-sun.svg')
        taskInput[0].classList.remove("addtask");
        filterList[0].style.backgroundColor = '#fff';
        

    }
    else
    {
        headerImg.style.backgroundImage = "url('./images/bg-desktop-dark.jpg')"
        /*
        day night icon var
        */
        timeIcon.setAttribute('src','./images/icon-moon.svg')
        taskInput[0].classList.add("addtask");
        filterList[0].style.backgroundColor = '#25273C';
        filterList[0].classList.add('clr-3')
        taskList.style.backgroundColor = '#25273C';
        bodyBg.style.backgroundColor = '#181824';
        taskList.style.boxShadow = '0px 4px 8px #000';
        taskList.style.color = '#dedede';
        activeFill.classList.add('clr-2');
        completeFill.classList.add('clr-2');
        
    }

    getTaskList().then(resp =>{
        addPoint = resp;
        showTask(addPoint)
      })
      .catch(error =>{
        console.log('Oops,Something Went Wrong '+error)
      })
}


//on focus change bg
function changeClass(){
    let taskInput = document.getElementsByClassName('no-dark')
    if(isDayTime)
    {
        taskInput[0].classList.remove("addtask");
    }
    else
    {
        taskInput[0].classList.add("addtask");
    }
}


/**
 * add to do function
 */
var addPoint = [];
var todoObject = {
    id:0,
    name : '',
    status: false
}
function addTodo(event){
    var self = this;
    if(event.target.value != ''){
        if(event.keyCode === 13){
            todoObject.id = todoObject.id + parseInt(1); 
            todoObject.name = event.target.value;
            var reqObj = {
                id : todoObject.id,
                name : event.target.value,
                status : false
            }
            addPoint.push(reqObj)
            addTaskList(reqObj)
            .then((data) => {
              console.log(data); // JSON data parsed by `data.json()` call
            });
            showTask(addPoint)
            
            event.target.value = '';
        }
    }
}

/*
    show tasks
*/ 
function showTask(arr){
    var self = this;
    var ul = document.getElementsByClassName('list-group')
    let totalTask = document.getElementById('totalTasks');
    ul[0].innerHTML = '';
    var htmlData = arr.map(safeHtml);
    ul[0].innerHTML = htmlData.join('');
    totalTask.innerHTML = addPoint.length + ' items left';
    let addedList = document.getElementsByClassName('hoverDel');
    let taskName = document.querySelectorAll('.taskName');
    let checkBg = document.querySelectorAll('.checkBg');
    if(!isDayTime){
        for(var i=0;i<addedList.length;i++){
            addedList[i].style.backgroundColor = '#25273C';
            checkBg[i].style.backgroundColor = '#25273C';
            taskName[i].style.color = '#fff';
        }
        
    }
}

/**
 * creating safe html to render task list
 */
function safeHtml(val,idx){
    var html = '';
    html += `<li class='list-group-item  hoverDel cursor' id='list${idx}' data-index='${idx}' draggable="true" ondragstart="drag(event,${idx})" ondrop="drop(event,${idx})" ondragover="allowDrop(event,${idx})" onClick='markComplete(${val.id})'>`
    html += `<span class='pr-5 cursor checkboxFour' >`
    if(val.status){
        html += `<input type='checkbox' checked='${val.status}' id='checkboxFourInput' name='' style='display:none'/>`
    }
    else
    {
       html += `<input type='checkbox' id='checkboxFourInput' name='' style='display:none'/>`
    }
    html += `  <label for='checkboxFourInput' class='checkBg'>`
    if(val.status){
        html += `<img src='images/icon-check.svg'>`
    }
    html += `</label>`
    html += `</span>`
    if(val.status == false){
        html += `<span class='plr-5 taskName' style='padding-left: 25px;'>${val.name}</span>`
    }
    else
    {
        html += `<span class='strike plr-5 taskName' style='padding-left: 25px;'>${val.name}</span>`
    }
    html += `<span class="float-end cross" onclick='removeTask(event,${idx},${val.id})'><img src="images/icon-cross.svg"></span>`
    html += ` </li>`
    return html;
}


/**
 * function to mark toggle between completed and ongoing task
 */
function markComplete(id){
    var self = this;
    addPoint.forEach(val =>{
        if(id == val.id){
            val.status = !val.status;
            updateTask(val).then(data =>{
                showTask(addPoint);
            })
        }
    })
    
}

/**
 * function to clear task
 */
function clearTask(){
    addPoint.forEach(val =>{
        deleteTask(val.id)
    })
    var ul = document.getElementsByClassName('list-group')
    let totalTask = document.getElementById('totalTasks');
    ul[0].innerHTML = '';
    getTaskList().then(resp =>{
        resp.forEach(val =>{
            deleteTask(val.id)
        })
        addPoint = [];
        totalTask.innerHTML = addPoint.length + ' items left';
    })
    
}

/**
 * function to show all task
 */
function showAll(){
    showTask(addPoint);
}

/**
 * function to show ongoing task
 */
function onGoing(){
    var temp = addPoint.filter(rec => !rec.status)
    showTask(temp);
    
}
/**
 * function to show complete task
 */
 function completeTask(){
    var temp = addPoint.filter(rec => rec.status)
    showTask(temp);
}
/**
 * remove task function
 */
function removeTask(event,index,id){
    event.stopPropagation();
    addPoint.splice(index,1);
    deleteTask(id).then((data)=>{

    })
    showTask(addPoint);
}

/**
 * drag and drop functionality
 */
var dragStartIndex
 function allowDrop(ev,index) {
    ev.preventDefault();
  }
  
  function drag(ev,index) {
    dragStartIndex = document.getElementById('list'+index).getAttribute('data-index');
    console.log(dragStartIndex)
  }
  
  function drop(ev,index) {
    ev.preventDefault();
    const dragEndIndex = +document.getElementById('list'+index).getAttribute('data-index');
    const swap = swapItems(dragStartIndex,dragEndIndex)
    addPoint = swap;
    showTask(swap)
  }

  /**
   * after drag swap items
   */
  function swapItems(idx1,idx2){
    var temp = addPoint[idx2]
    addPoint[idx2] = addPoint[idx1];
    addPoint[idx1] = temp;
    return addPoint;
  }