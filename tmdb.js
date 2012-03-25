var request = require('request');
String.prototype.format = function() {
    var content = this;
    for (var i=0; i < arguments.length; i++)
    {
        var replacement = '{' + i + '}';
        content = content.replace(replacement, arguments[i]);  
    }
    return content;
};

module.exports.init = function(apikey) {
    this.apikey = apikey;
    this.config = null;
    return this;
}

var apikey;
var config;

var base = 'http://api.themoviedb.org/3'; 
var api_urls =
    {
        configuration:              base+'/configuration?api_key={0}',
        misc_latest:                base+'/latest/movie?api_key={0}',
        misc_now_playing:           base+'/movie/now-playing?api_key={0}&page={1}',
        misc_popular:               base+'/movie/popular?api_key={0}&page={1}',
        misc_top_rated:             base+'/movie/top-rated?api_key={0}&page={1}',
        movie_info:                 base+'/movie/{0}?api_key={1}',
        movie_alternative_titles:   base+'/movie/{0}/alternative_titles?api_key={1}',
        movie_casts:                base+'/movie/{0}/casts?api_key={1}',
        movie_images:               base+'/movie/{0}/images?api_key={1}',
        movie_keywords:             base+'/movie/{0}/keywords?api_key={1}',
        movie_releases:             base+'/movie/{0}/releases?api_key={1}',
        movie_trailers:             base+'/movie/{0}/trailers?api_key={1}',
        movie_translations:         base+'/movie/{0}/translations?api_key={1}',
        person_info:                base+'/person/{0}?api_key={1}',
        person_credits:             base+'/person/{0}/credits?api_key={1}',
        person_images:              base+'/person/{0}/images?api_key={1}',
        collection_info:            base+'/collection/{0}?api_key={1}',
        search_movie:               base+'/search/movie?query={0}&api_key={1}&page={2}',
        search_person:              base+'/search/person?query={0}&api_key={1}&page={2}'
    };


module.exports.read_config = function(res) {
    this.config = res;
}

/**
 * misc. functions
 * all but the 'latest'-function has to be supplied with a page argument (can be null)
 **/
module.exports.Misc = {
    latest: function(callback) {
        var url = api_urls['misc_latest'].format(exports.apikey);
        exports.fetchexternal({url: url}, callback);
    },
    now_playing: function(p, callback) {
        var page = ((typeof p !== "number") ? page = 1 : page = p);
        var url = api_urls['misc_now_playing'].format(exports.apikey, page);
        exports.fetchexternal({url: url}, callback);
    },
    popular: function(p, callback) {
        var page = ((typeof p !== "number") ? page = 1 : page = p);
        var url = api_urls['misc_popular'].format(exports.apikey, page);
        exports.fetchexternal({url: url}, callback);
    },
    top_rated: function(p, callback) {
        var page = ((typeof p !== "number") ? page = 1 : page = p);
        var url = api_urls['misc_top_rated'].format(exports.apikey, page);
        exports.fetchexternal({url: url}, callback);
    }
};

/**
 * Get current configuration for constructing complete image urls
 **/
module.exports.Configuration =
    function(callback) {
        var url = api_urls['configuration'].format(exports.apikey);
        exports.fetchexternal({url: url}, callback);
    };

/**
 * Movie methods
 * q = id (can be either tmdb id or imdb id)
 **/
module.exports.Movie = {
    info: function(q, callback) {
        var url = api_urls['movie_info'].format(q, exports.apikey);
        exports.fetchexternal({url:url}, callback);
    },
    alternative_titles: function(q, callback) {
        var url = api_urls['movie_alternative_titles'].format(q, exports.apikey);
        exports.fetchexternal({url:url}, callback);
    },
    casts: function(q, callback) {
        var url = api_urls['movie_casts'].format(q, exports.apikey);
        exports.fetchexternal({url:url}, callback);
    },
    images: function(q, callback) {
        var url = api_urls['movie_images'].format(q, exports.apikey);
        exports.fetchexternal({url:url}, callback);
    },
    keywords: function(q, callback) {
        var url = api_urls['movie_keywords'].format(q, exports.apikey);
        exports.fetchexternal({url:url}, callback);
    },
    releases: function(q, callback) {
        var url = api_urls['movie_releases'].format(q, exports.apikey);
        exports.fetchexternal({url:url}, callback);
    },
    trailers: function(q, callback) {
        var url = api_urls['movie_trailers'].format(q, exports.apikey);
        exports.fetchexternal({url:url}, callback);
    },
    translations: function(q, callback) {
        var url = api_urls['movie_translations'].format(q, exports.apikey);
        exports.fetchexternal({url:url}, callback);
    },
};

/**
 * Search methods
 * q = {query: searchterm, page: page}
 * page defaults to 1 if not specified or invalid
 **/
module.exports.Search = {
    movie: function(q, callback) {
        var page = ((typeof q.page !== "number") ? page = 1 : page = q.page);
        var url = api_urls['search_movie'].format(q.query, exports.apikey, page);
        console.log(url);
        exports.fetchexternal({url:url}, callback);
    },
    person: function(q, callback) {
        var page = ((typeof q.page !== "number") ? page = 1 : page = q.page);
        var url = api_urls['search_person'].format(q.query, exports.apikey, page);
        exports.fetchexternal({url:url}, callback);
    }
};

/**
 * Person methods
 * q = {query: id}
 **/
module.exports.Person = {
    info: function(q, callback) {
        var url = api_urls['person_info'].format(q, exports.apikey);
        exports.fetchexternal({url:url}, callback);
    },
    credits: function(q, callback) {
        var url = api_urls['person_credits'].format(q, exports.apikey);
        exports.fetchexternal({url:url}, callback);       
    },
    images: function(q, callback) {
        var url = api_urls['person_images'].format(q, exports.apikey);
        exports.fetchexternal({url:url}, callback);       
    }
};

/**
 * Collection methods
 * q = {query: id}
 **/
module.exports.Collection = {
    info: function(q, callback) {
        var url = api_urls['collection_info'].format(q, exports.apikey);
        exports.fetchexternal({url: url}, callback);
    }
};

module.exports.fetchexternal = function(url,callback) {
    request(
        {
            uri:encodeURI(url.url),
            headers: {"Accept": 'application/json'}
        },
        function(err,res,body) {
            exports.handle(url,err,res,body,callback);
        }
    );
}

module.exports.handle = function(url, error, response, body, callback) {
    var res = null;
    try {
        res = JSON.parse(body);
    } catch(e) {
        console.error('Error parsing body. Body was:');
        console.error(body);
        error = 'Error parsing body.';
    }

    if(!error && response.statusCode == 200 && !res.status_code) {
        callback(undefined,res);
        return;
    }

    callback(error,res);
}
