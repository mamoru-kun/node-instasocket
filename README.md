# Node Instasocket

This is the Node.js version of [this](https://github.com/mamoru-kun/instasocket) project. This one can be easily deployed at Heroku.

## How it works
It gets posts from Instagram using your Instagram App's access token and requests them again and again every 10 seconds (you can change it in `.env`). If there's changes in posts collection the server sends it to all of the connected clients (your website visitors).

## Requirements
- Node.js >= 10.3.0

## Installation

### Your own VPS/VDS/dedicated server
1. Clone the project to your server
2. Run `npm install` or `yarn`
3. Make `.env` file by copying `.env.example` file
4. Register the Instagram app and get its access token
5. Add your access token in `.env` in `ACCESS_TOKEN` variable
6. `npm start` or `yarn start`

### Heroku
1. Clone the project to your server
2. `heroku create [project-name]`
3. `git push heroku master`
4. Register the Instagram app and get its access token
5. Add your access token in `.env` in `ACCESS_TOKEN` constant
6. Go to Heroku dashboard and set the config vars `ACCESS_TOKEN` and `ALLOWED_ORIGINS` in the settings section. *(`COUNT`, `REFRESH_DELAY` and `PORT` are optional to specify)*


## Configuration
As mentioned above, you should create a `.env` at the project's root. It must contain the `Config` class with next constants:

### `ACCESS_TOKEN (String)`
Instagram app's access token. [Here's a good article](https://elfsight.com/blog/2016/05/how-to-get-instagram-access-token/) that will be helpful for you.

### `COUNT (int)`
Amount of posts you need. Basically it's the value of `count` GET-parameter of the `/users/self/media/recent` endpoint.

### `REFRESH_DELAY (int)`
Posts collection refresh delay in seconds. Instagram allows to make up to **500** requests to its API per hour, so it's recommended set more then **15** seconds.

### `PORT (int)`
The port you want to host the web socket at.

### `ALLOWED_ORIGINS (string)`
The websites you want to accept the connection from. Set to `"*"` if you want to allow to use your web socket to everyone. You can define multiple origins by separating them with `,` (without whitespaces before or after the comma).

### `DEBUG_MODE (bool)`
Set to `0` in production.

## License
[MIT](LICENSE.md)
