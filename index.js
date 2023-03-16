const user = 'Paul'
// Greetings
const greetingContainer = document.querySelector('#greetings')
function checkTimeGreeting(time){
    const hour = time.getHours()
    if(hour>=0 && hour<12){
        return 'Good morning'
    }
    else if(hour>=12 && hour<18){
        return 'Good afternoon'
    }
    else if(hour>18 && hour<= 23){
        return 'Good evening'
    }
    else{
        return 'Welcome'
    }
}
function toogleGreeting(time) {
    greetingContainer.textContent = `${checkTimeGreeting(time)}, ${user}`
}
function checkTime(time){
    const timeContainer = document.querySelector('#time')
    timeContainer.textContent = ('0'+time.getHours()).slice(-2)+":"+('0'+ time.getMinutes()).slice(-2)
}
// Qoutes
var category = 'success'
function fetchQuotes(){
    $.ajax({
        method: 'GET',
        url: 'https://api.api-ninjas.com/v1/quotes?category=' + category,
        headers: { 'X-Api-Key': 'DSd6FPovthYiP8npib9Afg==qO4KqQ9W6uxnpcu9'},
        contentType: 'application/json',
        success: function(result) {
            displayQuotes(result)
        },
        error: function ajaxError(jqXHR) {
            console.error('Error: ', jqXHR.responseText);
        }
    });
}
function displayQuotes(quotesArr) {
    const quotes = document.querySelector('#quoteS')
    quotes.textContent = '"'+quotesArr[0].quote +'"'
    const author = document.querySelector('#author')
    author.textContent = `-${quotesArr[0].author}`
}
// Weather
let weather = {
    weatherAPi : {
    apiKey: '6bcb2167c56a56aa6921e65c22e62134',
    cityname: 'manila',
    unit: '&units=metric',
    fetchWeather : function (lat, lon, name) {
        fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}${this.unit}`
        )
        .then( res => res.json())
        .then(data =>{
            const {temp} = data.main;
            const cityName = name;
            const {icon} = data.weather[0]
            updateWeather(temp, icon, cityName)
        })
        }
    },
    geoCoder : {
            url :'http://api.openweathermap.org/geo/1.0/direct?q=',
            apiKey: '6bcb2167c56a56aa6921e65c22e62134',
            fetchCoordinate : function (city) {
                fetch(
                    this.url +
                    city +
                    '&limit=5&appid=' +
                    this.apiKey
                )
                .then(res => res.json())
                .then( data => {
                    this.parseData(data)
                });
        },
        parseData : function(data){
            firstResult = data[0]
            const {name} = firstResult
            const {lon, lat} = firstResult
            weather.weatherAPi.fetchWeather(lat,lon, name)
        }
    }
}
function updateWeather(temp, icon,cityName) {
    tempUnit = '°C'
    iconURL = 'https://openweathermap.org/img/wn/'+icon+'.png'
    const temperatureReading = document.querySelector('#temperature-reading')
    temperatureReading.textContent = temp+tempUnit;
    const cityContainer = document.querySelector('#city-container')
    cityContainer.textContent = cityName
    const weatherIcon = document.querySelector('#weather-icon')
    weatherIcon.setAttribute('src',iconURL)

}
// todo
const todoSidebar = document.querySelector('#todo-sidebar')
const todoContainer = document.querySelector('#todo-container')
const todoArrow = document.querySelector('#todo-sidebar span')
const todoList = document.querySelector('#todo-list')
const addTodoButton = document.querySelector('#add-todo-button');
const addTodoInput = document.querySelector('#add-todo-input');
const submitTodo = document.querySelector('#submit-todo')
const todoInput = document.querySelector('#todo-input')
const todoHero = document.querySelector('#todo-hero');
const todoItemsArr = document.querySelectorAll('.todo-item');

// local storage
let todoArr = JSON.parse(window.localStorage.getItem('todoArr') || [])
let uncheckedTodo;
function fetchStoreTodo(){
    window.localStorage.setItem('todoArr', JSON.stringify(todoArr))
    todoArr = JSON.parse(window.localStorage.getItem('todoArr'))
    refreshUncheckTodo()
}
fetchStoreTodo()

function refreshUncheckTodo() {
    uncheckedTodo = []
    for (let i = 0; i < todoArr.length; i++) {
        const todo= todoArr[i]
        if (todo.isComplete === false) {
            uncheckedTodo.push({'todo': todo.todo, 'isComplete': todo.isComplete, 'index': i})
        }
    }
}

window.localStorage.setItem('todoArr', JSON.stringify(todoArr))

todoSidebar.addEventListener('click', ()=>{
    todoContainerToggle()
    toggleTodoArrow()
})
// SUBMIT Button
submitTodo.addEventListener('click',()=>{
    toggleTodoInput()
    addTodoArr()
    clearTodoInput()
    refreshTodo()
})
addTodoButton.addEventListener('click',()=>{
    toggleTodoInput()
})
// TOGGLE CONTAINER WHEN CLICKED OUTSIDE
window.onclick= (e)=>{
    if(
    !e.target.parentElement.classList.contains('todo') 
    && 
    todoContainer.classList.contains('active'))
        {
        toggleTodoArrow()
        todoContainer.classList.remove('active')
    }
}
function todoContainerToggle(){
    todoContainer.classList.toggle('active')
}
function toggleTodoArrow(){
    if (todoArrow.textContent =='chevron_right') {
        todoArrow.textContent = 'chevron_left'
    }
    else{
        todoArrow.textContent = 'chevron_right'
    }
}
function toggleTodoInput(){
    addTodoButton.classList.toggle('hidden')
    addTodoInput.classList.toggle('hidden')
}
function refreshTodo() {
    fetchStoreTodo()
    clearTodoList()
    renderTodos()
    displayToHero()
}
function renderTodos() {
    if(todoArr.length == 0){
        const noTodo = document.createElement('p')
        noTodo.textContent = "No todo available"
        todoList.append(noTodo)
    }
    for (let i = 0; i < todoArr.length; i++) {
        const toDo = todoArr[i]
        createTodo(toDo, i, todoList)
    }
}
function toggleIsComplete(index){
    if(todoArr[index].isComplete == true){
        todoArr[index].isComplete = false
    }
    else{
        todoArr[index].isComplete = true
    }
}
function addTodoArr(){
    todoTextContent = todoInput.textContent
    if(todoTextContent!=''){
        todo = {'todo': todoTextContent}
        todo.isComplete = false
        todoArr.unshift(todo)
    }
}
function clearTodoInput() {
    todoInput.textContent =''
}
function createTodo(toDo, index, container){
    const todoItem = document.createElement('li')
    const checkbox = document.createElement('input')
    // create delete icon
    const deleteIcon = document.createElement('span')
    deleteIcon.setAttribute('class', "material-symbols-outlined delete-icon")
    deleteIcon.innerHTML = 'delete'
    // create checkbox
    checkbox.setAttribute('type','checkbox')
    todoItem.setAttribute('class', 'todo todo-item')
    const todoText = document.createElement('p')
    todoText.setAttribute('contenteditable', 'true')
    todoText.textContent = toDo.todo;
    // retreive checkbox from previous display
    if(toDo.isComplete == true){
        checkbox.setAttribute('checked', null)
        todoText.classList.add('checked')
    }
    // checkbox eventhandler
    checkbox.addEventListener('click',()=>{
        toggleIsComplete(index)
        displayToHero()
        refreshTodo()
    })
    deleteIcon.addEventListener('click',()=>{
        todoArr.splice(index,1)
        displayToHero()
        refreshTodo()
    })
    // todolist edit event handler
    todoText.addEventListener('input',(e)=>{
        todoArr[index].todo = e.target.textContent
        window.localStorage.setItem('todoArr', JSON.stringify(todoArr))
        if (container.classList.contains('todo-list')) {
            todoHero.innerHTML =''
            refreshUncheckTodo()
            displayToHero()
        }
        else{
            todoList.innerHTML = ''
            renderTodos()
        }
  
    })
    todoItem.append(checkbox)
    todoItem.append(todoText)
    todoItem.append(deleteIcon)
    container.append(todoItem)
}
function clearTodoList(){
    todoList.innerHTML =''
    todoHero.innerHTML =''
}
function displayToHero(){
    if(uncheckedTodo.length == 0){
        const heroTodo = document.createElement('p');
        heroTodo.textContent = 'Nothing to do today'
        todoHero.append(heroTodo)
    }
    else{
        index = uncheckedTodo[0].index
        createTodo(uncheckedTodo[0], index, todoHero)
    }
}
// background
const backgroundHero = document.querySelector('.hero')
fetch('./background.json')
.then( res => res.json())
.then( backgrounds =>{
    displayBackground(backgrounds)
})
function displayBackground(backgrounds){
    const timeOfday = new Date().getHours()
    let backgroundScene;
    if (timeOfday >=0 && timeOfday <=6) {
        backgroundScene = backgrounds.sunrise
    }
    else{
        backgroundScene = backgrounds.sunrise
    }
    let i =  0
    backgroundHero.style.backgroundImage = `url(${backgroundScene[i].url})`
    setInterval(() => {
        i++
        if(backgroundScene.length == i){
            i = 0
        }
        backgroundHero.style.backgroundImage = `url(${backgroundScene[i].url})`
    }, 60000);
}

fetchQuotes()
displayToHero()
renderTodos(todoArr)

const city = 'Cebu'
weather.geoCoder.fetchCoordinate(city)
setInterval(()=>{
    weather.geoCoder.fetchCoordinate(city)
},30000)
// quotes interval
setInterval(() => {
    fetchQuotes()
}, 60000);
// time interval
setInterval(()=>{
    const time = new Date();
    toogleGreeting(time);
    checkTime(time)
},1000)
