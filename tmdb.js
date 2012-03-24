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

var urlprefix = 'http://api.themoviedb.org/3';

var api_urls =
    {
        configuration: '{0}/configuration?api_key={1}',
        misc_latest: '{0}/latest/movie?api_key={1}',
        misc_now_playing: '{0}/movie/now-playing?api_key={1}&page={2}',
        misc_popular: '{0}/movie/popular?api_key={1}&page={2}',
        misc_top_rated: '{0}/movie/top-rated?api_key={1}&page={2}',
        movie_info: '{0}/movie/{1}?api_key={2}',
        movie_alternative_titles: '{0}/alternative_titles?api_key={2}',
        movie_casts: '{0}/movie/{1}/casts?api_key={2}',
        movie_images: '{0}/movie/{1}/images?api_key={2}',
        movie_keywords: '{0}/movie/{1}/keywords?api_key={2}',
        movie_releases: '{0}/movie/{1}/releases?api_key={2}',
        movie_trailers: '{0}/movie/{1}/trailers?api_key={2}',
        movie_translations: '{0}/movie/{1}/translations?api_key={2}',
        person_info: '{0}/person/{1}?api_key={2}',
        person_credits: '{0}/person/{1}/credits?api_key={2}',
        person_images: '{0}/person/{1}/images?api_key={2}',
        collection_info: '{0}/collection/{1}?api_key={2}',
        search_movie: '{0}/search/movie?query={1}&api_key={2}&page={3}',
        search_person: '{0}/search/person?query={1}&api_key={2}&page={3}'
    };

this.init = function(apikey) {
    this.apikey = apikey;
    this.config = null;
    return this;
}

this.read_config = function(res) {
    this.config = res;
}

this.apikey;
this.config;

/**
 * misc. functions
 * all but the 'latest'-function has to be supplied with a page argument (can be null)
 **/
this.Misc = {
    latest: function(callback) {
        var url = api_urls['misc_latest'].format(urlprefix, exports.apikey);
        exports.fetchexternal({url: url}, callback);
    },
    now_playing: function(p, callback) {
        var page = ((typeof p !== "number") ? page = 1 : page = p);
        var url = api_urls['misc_now_playing'].format(urlprefix, exports.apikey, page);
        exports.fetchexternal({url: url}, callback);
    },
    popular: function(p, callback) {
        var page = ((typeof p !== "number") ? page = 1 : page = p);
        var url = api_urls['misc_popular'].format(urlprefix, exports.apikey, page);
        exports.fetchexternal({url: url}, callback);
    },
    top_rated: function(p, callback) {
        var page = ((typeof p !== "number") ? page = 1 : page = p);
        var url = api_urls['misc_top_rated'].format(urlprefix, exports.apikey, page);
        exports.fetchexternal({url: url}, callback);
    }
};

/**
 * Get current configuration for constructing complete image urls
 **/
this.Configuration =
    function(callback) {
        var url = api_urls['configuration'].format(urlprefix, exports.apikey);
        exports.fetchexternal({url: url}, callback);
    };

/**
 * Movie methods
 * q = id (can be either tmdb id or imdb id)
 **/
this.Movie = {
    info: function(q, callback) {
        var url = api_urls['movie_info'].format(urlprefix, q, exports.apikey);
        exports.fetchexternal({url:url}, callback);
    },
    alternative_titles: function(q, callback) {
        var url = api_urls['movie_alternative_titles'].format(urlprefix, q, exports.apikey);
        exports.fetchexternal({url:url}, callback);
    },
    casts: function(q, callback) {
        var url = api_urls['movie_casts'].format(urlprefix, q, exports.apikey);
        exports.fetchexternal({url:url}, callback);
    },
    images: function(q, callback) {
        var url = api_urls['movie_images'].format(urlprefix, q, exports.apikey);
        exports.fetchexternal({url:url}, callback);
    },
    keywords: function(q, callback) {
        var url = api_urls['movie_keywords'].format(urlprefix, q, exports.apikey);
        exports.fetchexternal({url:url}, callback);
    },
    releases: function(q, callback) {
        var url = api_urls['movie_releases'].format(urlprefix, q, exports.apikey);
        exports.fetchexternal({url:url}, callback);
    },
    trailers: function(q, callback) {
        var url = api_urls['movie_trailers'].format(urlprefix, q, exports.apikey);
        exports.fetchexternal({url:url}, callback);
    },
    translations: function(q, callback) {
        var url = api_urls['movie_translations'].format(urlprefix, q, exports.apikey);
        exports.fetchexternal({url:url}, callback);
    },
};

/**
 * Search methods
 * q = {query: searchterm, page: page}
 * page defaults to 1 if not specified or invalid
 **/
this.Search = {
    movie: function(q, callback) {
        var page = ((typeof q.page !== "number") ? page = 1 : page = q.page);
        var url = api_urls['search_movie'].format(urlprefix, q.query, exports.apikey, page);
        exports.fetchexternal({url:url}, callback);
    },
    person: function(q, callback) {
        var page = ((typeof q.page !== "number") ? page = 1 : page = q.page);
        var url = api_urls['search_person'].format(urlprefix, q.query, exports.apikey, page);
        exports.fetchexternal({url:url}, callback);
    }
};

/**
 * Person methods
 * q = {query: id}
 **/
this.Person = {
    info: function(q, callback) {
        var url = api_urls['person_info'].format(urlprefix, q, exports.apikey);
        exports.fetchexternal({url:url}, callback);
    },
    credits: function(q, callback) {
        var url = api_urls['person_credits'].format(urlprefix, q, exports.apikey);
        exports.fetchexternal({url:url}, callback);       
    },
    images: function(q, callback) {
        var url = api_urls['person_images'].format(urlprefix, q, exports.apikey);
        exports.fetchexternal({url:url}, callback);       
    }
};

/**
 * Collection methods
 * q = {query: id}
 **/
this.Collection = {
    info: function(q, callback) {
        var url = api_urls['collection_info'].format(urlprefix, q, exports.apikey);
        exports.fetchexternal({url: url}, callback);
    }
};

this.fetchexternal = function(url,callback) {
    console.log('Looking up url: '+url.url+'.');
    request({uri:encodeURI(url.url), headers:{"Accept": 'application/json'}}, function(error,response,body) {
        exports.handle(url,error,response,body,callback);
    });
}

exports.handle = function(url, error, response, body, callback) {
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
