### Installation
```
npm install --save tmdbv3
```

### Usage
```js
const tmdb = require('tmdbv3').init(key);

tmdb.misc.latest((err ,res) => {
	console.log(res.title);
});

tmdb.movie.info(5, (err ,res) => {
	console.log(res.title);	
});

tmdb.person.info(109, (err ,res) => {
	console.log(res.name);	
});

// setting french as default language...
tmdb.setLanguage('fr');
// and resetting to english.
tmdb.resetLanguage();
```
etc.

All methods live right now (2012-08-08) implemented.

Testing is done by mocha.

See [the TMDb page about the API](https://www.themoviedb.org/documentation/api) or [view the full API](http://docs.themoviedb.apiary.io/)

### Other

For TMDb's old v2.1 api, go to [kkarikos repo] (https://raw.github.com/kkarikos/tmdb).

kkariko: I used part of your request code here, contact me if you have questions, I can't find a way to contact you.
