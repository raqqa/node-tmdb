### Dependencies

[request] (https://github.com/mikeal/request)

##### Optional for testing

[mocha] (https://github.com/visionmedia/mocha) 

[should] (https://github.com/visionmedia/should.js)

### Usage

```
var tmdb = require('./tmdb').init(key);

tmdb.misc.latest(function(err,res) {
	console.log(res.title);
});

tmdb.movie.info(5, function(err,res) {
	console.log(res.title);	
});

tmdb.person.info(109, function(err,res) {
	console.log(res.name);	
});

```
etc.

All methods live right now (2012-08-08) implemented.

Testing is done by mocha.

See [http://help.themoviedb.org/kb/api/about-3] (TMDb v3 page about the api)

### TO DO

No language support because I don't use it personally, can be added on request or better yet: add it yourself and make  a pull request. :)

### Other

For TMDb's old v2.1 api, go to [kkarikos repo] (https://raw.github.com/kkarikos/tmdb).

kkariko: I used part of your request code here, contact me if you have questions, I can't find a way to contact you.
