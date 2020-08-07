# Weather City Application
Users can search any city they want to check with the help of auto-complete text. Also users can check 7 days outlook.

## Getting Started
This web-application is developed with vanilla-js. With vanilla-js, I tried to do not use many packages from npm.
However I had to use some packages like express, and the others to manage .env and csv file.
If you want to check how this code is working on actual site. You can go to this link.
https://weather-city-pro.herokuapp.com/

## Prerequisites
-	Node.js
-	heroku account (if you have any other solution to deploy web-app, you can use it)
-	openweathermap(https://openweathermap.org/) account (this web-app uses openweathermap api, you can register and get free one)
- csv file (column 1: city name, column 2: country name)

Also, this web app uses a several npm packages.
-	express
-	Pug
-	dotenv
- csv-parser

*you should do following command to install those packages.
```
npm install
```

*for csv file, you have to make 'data' folder and put 'worldcities_weather.csv'.
Otherwise, you can change the name of it on line 13 of 'index.js'.

### Front-end
This web-application is designed with pug to make easy to transfer data.
It is made with pure css and doesn't use and library like Bootstrap.

## Version
1.0.0

### Upcoming update
1.	make secure way to transfer the api key data.
2.	convert web-app to PWA(Progressive Web App) or Mobile App

## Authors
**MINHO CHOI** http://www.minhoproject.studio

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

