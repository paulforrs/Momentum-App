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
let quotes ={
    url: 'https://zenquotes.io/api/today',
    fetchQuotes: function(){
        fetch(
           'https://api.quotable.io/quotes?tags=inspirational'
        )
        .then(res => res.json())
        .then(data =>{
            // console.log(data)
        })
    }
}
// quotes.fetchQuotes()


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
console.log(todoListArr);
todoSidebar.addEventListener('click', ()=>{
    todoContainerToggle()

})

window.onclick= (e)=>{
    console.log(e.target.parentElement.classList.contains('todo'))
    if(!e.target.parentElement.classList.contains('todo')){
        todoContainerToggle()
    }
}

function todoContainerToggle(){
    todoContainer.classList.toggle('active')
    if (todoArrow.textContent =='chevron_right') {
        todoArrow.textContent = 'chevron_left'
    }
    else{
        todoArrow.textContent = 'chevron_right'
    }
}
function addTodoToggle(){
    
}
// function checkTodo(params) {
//     console.log(todoListArr)
// }

addEventListener

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
setInterval(()=>{
    weather.geoCoder.fetchCoordinate(city)
},10000)