const user = 'Paul'
// Time
const timeContainer = document.querySelector('#time')
const time = new Date()
console.log(time)
// time.setHours(9)
console.log();
setInterval(()=>{
    timeContainer.textContent = ('0'+time.getHours()).slice(-2)+":"+('0'+ time.getMinutes()).slice(-2)
},1000)

// Greetings
const greetingContainer = document.querySelector('#greetings')
function checkTimeGreeting(){
    const hour = time.getHours()
    console.log(hour);
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
function toogleGreeting() {
    greetingContainer.textContent = `${checkTimeGreeting()}, ${user}`
}
setInterval( toogleGreeting(), 60000)

// Qoutes
let quotes ={
    url: 'https://zenquotes.io/api/today',
    fetchQuotes: function(){
        fetch(
           'https://api.quotable.io/quotes?tags=inspirational'
        )
        .then(res => res.json())
        .then(data =>{
            console.log(data)
        })
    }
}
quotes.fetchQuotes()


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
            const {temp} = data.main
            const cityName = name;
            updateWeather(temp, cityName)
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
function updateWeather(temperature, cityName) {
    const temperatureReading = document.querySelector('#temperature-reading')
    temperatureReading.textContent = temperature;
    console.log(temperature)

    const cityContainer = document.querySelector('#city-container')
    cityContainer.textContent = cityName
}
weather.geoCoder.fetchCoordinate('tokyo')