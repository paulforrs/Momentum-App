const user = 'Paul'
// Time

// const time = new Date()


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
// let quotes ={
//     url: 'https://zenquotes.io/api/today',
//     fetchQuotes: function(){
//         fetch(
//            'https://api.quotable.io/quotes?tags=inspirational'
//         )
//         .then(res => res.json())
//         .then(data =>{
//             this.parseData(data)
//         })
//     },
//     parseData : function(data){
//         const quotesArr = []
//         data.results.forEach( quotes =>{
//             quotesArr.push({'author':quotes.author ,content: quotes.content})
//         })
//         displayQuotes(quotesArr)
//     }
// }
function displayQuotes(quotesArr) {
    // const index = Math.floor(Math.random()*quotesArr.length+1)
    const quotes = document.querySelector('#quotes')
    // const quotesContent = quotesArr.splice(index, 1)
    quotes.textContent = '"'+quotesArr[0].quote +'"'
}

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


// Weather
let weather = {
    weatherAPi : {
    // url : `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}`,
    apiKey: '6bcb2167c56a56aa6921e65c22e62134',
    cityname: 'manila',
    unit: '&units=metric',
    fetchWeather : function (lat, lon, name) {
        fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}${this.unit}`
            // this.url
            // +
            // city
            // +'&appid='
            // + this.apiKey
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
    // const iconImg = document.querySelector('#weather-icon')
    weatherIcon.setAttribute('src',iconURL)

}


// todo
const todoSidebar = document.querySelector('#todo-sidebar')
const todoContainer = document.querySelector('#todo-container')
const todoArrow = document.querySelector('#todo-sidebar span')
const todoListArr = Array.from(document.querySelectorAll('#todo-list >*'))
const addTodoButton = document.querySelector('#add-todo-button');
const addTodoInput = document.querySelector('#add-todo-input');
const submitTodo = document.querySelector('#submit-todo')

todoSidebar.addEventListener('click', ()=>{
    todoContainerToggle()
    toggleTodoArrow()
})
submitTodo.addEventListener('click',()=>{
    toggleTodoInput()
})
addTodoButton.addEventListener('click',()=>{
    toggleTodoInput()
})
window.onclick= (e)=>{
    if(!e.target.parentElement.classList.contains('todo') && todoContainer.classList.contains('active')){
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
// function addTodoToggle(){

// }
function createTodo(){
    const todoItem = document.createElement('li')
    const checkbox = document.createElement('input').setAttribute('type','checkbox')
}
setInterval(()=>{
    const time = new Date();
    toogleGreeting(time);
    checkTime(time)

},1000)


const city = 'cebu'
weather.geoCoder.fetchCoordinate(city)
// setInterval(()=>{
//     weather.geoCoder.fetchCoordinate(city)
// },30000)
// setInterval(() => {
//     fetchQuotes()
// }, 60000);
// fetchQuotes()