// Default values
let user = 'Guest'
let todoArr = []
let uncheckedTodo = [];
let city = 'London';
let momentumApp = {}
// local storage
const dataBase =  {
    get: function(){
        momentumApp = JSON.parse(localStorage.getItem('MomentumApp')) ||{}
        console.log('get')
        if (Object.keys(momentumApp).length != 0) {
            console.log(Object.keys(momentumApp))
            user = momentumApp.currentUser
            todoArr = momentumApp[user].todoArr
        }
        todoHeroSection.fetchUnchecked()
    },
    addNewUser: function () {
        user = newUser.value
        momentumApp[user] = {
            'user' : user,
            'isHours24': hours24,
            'city': city,
            'todoArr': []
                }
        momentumApp.currentUser = user
        window.localStorage.setItem('MomentumApp', JSON.stringify(momentumApp))
    },
    set:function() {
        momentumApp.currentUser = user
        window.localStorage.setItem('MomentumApp', JSON.stringify(momentumApp))
    },
    changeUser : function(user){
        momentumApp.currentUser = user
    }
}
// Greetings and Time
let hours24 = false;
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
// User modal
const userModal = document.querySelector('#user-modal')
const modalClose = document.querySelector('#modal-close')
const addUser = document.querySelector('#add-user')
const newUser = document.querySelector('#new-user')
const newUserButton = document.querySelector('#new-user-button')
const newUserInput = document.querySelector('#new-user-wrapper')

const userName = document.querySelector('#user-name')
userName.addEventListener('click',()=>{
    modalUser.create()
    toggleModal()
})
function setUser() {
    if(user==''){
        user = '  '
    }
    userName.textContent = user
}
function toggleModal() {
    userModal.classList.toggle('hidden')
}
function toggleNewUserInputButton(){
    newUserInput.classList.toggle('hidden')
    newUserButton.classList.toggle('hidden')
}
// Display User in Modal
const userProfileList = document.querySelector('#user-profile-list')
let modalUser = {
    create : function(){
        userProfileList.textContent = ''
        for(profile in momentumApp){
            if(profile == 'currentUser'){
                continue
            }
            const userWrapper = document.createElement('li')
            const userText = document.createElement('p')
            userText.textContent = profile
            userWrapper.setAttribute('id', profile)
            // changeing User
            userText.addEventListener('click',(e)=>{
                user = e.target.parentElement.id
                refreshTodo()
                toggleModal()
            })
            // delete Icon
            const deleteUser = document.createElement('span')
            deleteUser.setAttribute('class', "material-symbols-outlined delete-icon")
            deleteUser.innerHTML = 'delete'
            deleteUser.addEventListener('click',(e)=>{
                const userDelete = e.target.parentElement.id
                console.log(userDelete)
                if(userDelete == user){
                    alert('Currently in user')
                }
                if(userDelete == 'Guest'){
                    alert('Can\'t delete default user')
                }
                else{
                    delete momentumApp[e.target.parentElement.id]
                    dataBase.set()
                    dataBase.get()
                    modalUser.refresh()
                }
            })
            userWrapper.append(userText)
            userWrapper.append(deleteUser)
            userProfileList.append(userWrapper)
        };
    },
    newUser: function(){

    },
    refresh: function(){
            userProfileList.innerHTML =''
            modalUser.create()
    }
}
newUserButton.addEventListener('click',()=>{
    console.log('button');
    toggleNewUserInputButton()
})
modalClose.addEventListener('click',()=>{
    console.log('close Icon')
    toggleModal()
})
addUser.addEventListener('click',()=>{
    toggleNewUserInputButton()
    dataBase.addNewUser()
    dataBase.get()
    toggleModal()
    setUser()
})
// Time
function toogleGreeting(time) {
    const greetingContainer = document.querySelector('#greetings')
    greetingContainer.textContent = `${checkTimeGreeting(time)}`
}
function checkTime(time){
    const timeContainer = document.querySelector('#time')
    let hrs = time.getHours()
    const minute = time.getMinutes()
    if(hours24 == false){
        if (hrs > 13 && hrs < 23) {
            hrs = hrs -12
        }
    }
    timeContainer.textContent = ('0'+hrs).slice(-2)+":"+('0'+ minute).slice(-2)
}
// Qoutes
var category = 'success'
let quotes = {
    fetch : function(){
        $.ajax({
            method: 'GET',
            url: 'https://api.api-ninjas.com/v1/quotes?category=' + category,
            headers: { 'X-Api-Key': 'DSd6FPovthYiP8npib9Afg==qO4KqQ9W6uxnpcu9'},
            contentType: 'application/json',
            success: function(result) {
                quotes.display(result)
            },
            error: function ajaxError(jqXHR) {
                console.error('Error: ', jqXHR.responseText);
            }
        });
    }, 
    display : function(quotesArr){
        const quotes = document.querySelector('#quoteS')
        quotes.textContent = '"'+quotesArr[0].quote +'"'
        const author = document.querySelector('#author')
        author.textContent = `-${quotesArr[0].author}`
    }
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
const todoItemsArr = document.querySelectorAll('.todo-item')

const todoWidget ={
    // add todo to todo Array
    addTodo: function() {
        todoTextContent = todoInput.textContent
        if(todoTextContent!=''){
            todo = {'todo': todoTextContent}
            todo.isComplete = false
            todoArr.unshift(todo)
        }
    },
    // create elements for Todo
    create : function(toDo, index, container){
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
            refreshTodo()

        })
        deleteIcon.addEventListener('click',()=>{
            todoArr.splice(index,1)
            todoHeroSection.display()
            refreshTodo()
        })
        // todolist edit event handler
        todoText.addEventListener('input',(e)=>{
            todoArr[index].todo = e.target.textContent
            window.localStorage.setItem('todoArr', JSON.stringify(todoArr))
            if (container.classList.contains('todo-list')) {
                todoHeroSection.clear()
                dataBase.set()
                dataBase.get()
                todoHeroSection.display()
            }
            else{
                todoWidget.clear()
                dataBase.set()
                dataBase.get()
                todoWidget.display()
            }
    
        })
        todoItem.append(checkbox)
        todoItem.append(todoText)
        todoItem.append(deleteIcon)
        container.append(todoItem)
        },
        // display todo to todo Widget
    display : function(){
        if(todoArr.length == 0){
            const noTodo = document.createElement('p')
            noTodo.textContent = "No todo available"
            todoList.append(noTodo)
        }
        for (let i = 0; i < todoArr.length; i++) {
            const toDo = todoArr[i]
            todoWidget.create(toDo, i, todoList)
        }
    },

    clear: function(){
        console.log('widget cleared')
        todoList.innerHTML =''
    }
}

const todoHeroSection = {
    clear: function(){
        console.log('Hero cleared')
        todoHero.textContent =''
    },
    fetchUnchecked : function(){
        uncheckedTodo = []
        for (let i = 0; i < todoArr.length; i++) {
            const todo= todoArr[i]
            if (todo.isComplete === false) {
                uncheckedTodo.push({'todo': todo.todo, 'isComplete': todo.isComplete, 'index': i})
            }
        }
    },
    // display Todo to hero section
    display: function(){
        if(uncheckedTodo.length == 0){
            console.log(uncheckedTodo);
            const heroTodo = document.createElement('p');
            heroTodo.textContent = 'Nothing to do today'
            todoHero.append(heroTodo)
        }
        else{
            console.log(uncheckedTodo);
            index = uncheckedTodo[0].index
            todoWidget.create(uncheckedTodo[0], index, todoHero)
        }
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
    dataBase.set()
    dataBase.get()
    todoHeroSection.fetchUnchecked()
    todoWidget.clear()
    todoHeroSection.clear()
    todoWidget.display()
    todoHeroSection.display()
    setUser()
}
function toggleIsComplete(index){
    if(todoArr[index].isComplete == true){
        todoArr[index].isComplete = false
    }
    else{
        todoArr[index].isComplete = true
    }
}
function clearTodoInput() {
    todoInput.textContent =''
}
function refreshUncheckTodo() {

}

window.localStorage.setItem('todoArr', JSON.stringify(todoArr))

todoSidebar.addEventListener('click', ()=>{
    todoContainerToggle()
    toggleTodoArrow()
})
// SUBMIT Button
submitTodo.addEventListener('click',()=>{
    toggleTodoInput()
    todoWidget.addTodo()
    clearTodoInput()
    refreshTodo()
})
addTodoButton.addEventListener('click',()=>{
    toggleTodoInput()
})
// TOGGLE CONTAINER WHEN CLICKED OUTSIDE
window.onclick= (e)=>{
    // if clicked outside Todo widget, widget closes
    if(
    !e.target.parentElement.classList.contains('todo') 
    && 
    todoContainer.classList.contains('active'))
        {
        toggleTodoArrow()
        todoContainer.classList.remove('active')
    }
    if(e.target.id == 'user-modal'){
        console.log('window')
        toggleModal()
    }
    if(!e.target.classList.contains('new-user') 
    &&
    e.target.id != 'new-user-button'
    &&
    newUserButton.classList.contains('hidden')){
        toggleNewUserInputButton()
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
// initialize
function startUp() {
    dataBase.get()
    quotes.fetch()
    todoWidget.display()
    todoHeroSection.fetchUnchecked()
    todoHeroSection.display()
    setUser()
    weather.geoCoder.fetchCoordinate(city)
}


setInterval(()=>{
    weather.geoCoder.fetchCoordinate(city)
},30000)
// quotes interval
setInterval(() => {
    quotes.fetch()
}, 60000);
// time interval
setInterval(()=>{
    const time = new Date();
    toogleGreeting(time);
    checkTime(time)
},1000)
startUp()
