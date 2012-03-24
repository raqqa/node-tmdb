var request = require('request');
var util = require('./util');

var urlprefix = 'http://api.themoviedb.org/3';

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
 * constructs the search and info queries
 **/
var buildUrl = function(query,opts) {
    console.log(exports.config);
    page = opts.page || 1;
    if(opts.details) {
        details = '/'+opts.details;
    } else {
        details = ''
    }

    if (opts.type == 'search') {
        var url = urlprefix+'/'+opts.type+'/'+opts.details+'?query='+encodeURIComponent(query.query)+'&page='+page+'&api_key='+exports.apikey;
    } else {
        var url = urlprefix+'/'+opts.type+'/'+encodeURIComponent(query.query)+details+'?api_key='+exports.apikey;
    }
    return { url: url };
}

// "static" queries
var simpleUrl = function(opts) {
    page = opts.page || 1;
    if (opts.type == 'configuration') {
        var url = urlprefix+'/'+opts.type+'?api_key='+exports.apikey;
        return { url: url };
    }
    var url = urlprefix+'/'+opts.type+'/'+opts.query+'?api_key='+exports.apikey+'&page='+page;
    return { url: url };
}

/**
 * misc. functions
 * all but the 'latest'-function has to be supplied with a page argument (can be null)
 **/
this.Misc = {
    latest: function(callback) {
        opts = {type: 'latest', query: 'movie'};
        exports.fetchexternal(simpleUrl(opts), callback);
    },
    now_playing: function(p, callback) {
        opts = {type: 'movie', query: 'now-playing'};
        opts["page"] = p || 1;
        exports.fetchexternal(simpleUrl(opts), callback);
    },
    popular: function(p, callback) {
        opts = {type: 'movie', query: 'popular'};
        opts["page"] = p || 1;
        exports.fetchexternal(simpleUrl(opts), callback);
    },
    toprated: function(p, callback) {
        opts = {type: 'movie', query: 'top-rated'};
        opts["page"] = p || 1;
        exports.fetchexternal(simpleUrl(opts), callback);
    }
};

/**
 * Get current configuration for constructing complete image urls
 **/
this.Configuration =
    function(callback) {
        opts = {type: 'configuration', query: ''};
        exports.fetchexternal(simpleUrl(opts), callback);
    };

/**
 * Movie methods
 * q = {query: id} - id can be either tmdb id or imdb id (tt**)
 **/
this.Movie = {
    info: function(q, callback) {
        opts = {type: 'movie', symbol: '?'};
        exports.fetchexternal(buildUrl(q,opts), callback);
    },
    alternative_titles: function(q, callback) {
        opts = {type: 'movie', details: 'alternative_titles', symbol: '?'};
        exports.fetchexternal(buildUrl(q,opts), callback);       
    },
    casts: function(q, callback) {
        opts = {type: 'movie', details: 'casts', symbol: '?'};
        exports.fetchexternal(buildUrl(q,opts), callback);       
    },
    images: function(q, callback) {
        opts = {type: 'movie', details: 'images', symbol: '?'};
        exports.fetchexternal(buildUrl(q,opts), callback);       
    },
    keywords: function(q, callback) {
        opts = {type: 'movie', details: 'keywords', symbol: '?'};
        exports.fetchexternal(buildUrl(q,opts), callback);       
    },
    releases: function(q, callback) {
        opts = {type: 'movie', details: 'releases', symbol: '?'};
        exports.fetchexternal(buildUrl(q,opts), callback);       
    },
    trailers: function(q, callback) {
        opts = {type: 'movie', details: 'trailers', symbol: '?'};
        exports.fetchexternal(buildUrl(q,opts), callback);       
    },
    translations: function(q, callback) {
        opts = {type: 'movie', details: 'translations', symbol: '?'};
        exports.fetchexternal(buildUrl(q,opts), callback);       
    },
};

/**
 * Search methods
 * q = {query: searchterm, page: page}
 * page defaults to 1 if not specified
 **/
this.Search = {
    movie: function(q, callback) {
        page = q.page || 1;
        opts = {type: 'search', details: 'movie', page: page};
        exports.fetchexternal(buildUrl(q,opts), callback);
    },
    person: function(q, callback) {
        page = q.page || 1;
        opts = {type: 'search', details: 'person', page: page};
        exports.fetchexternal(buildUrl(q,opts), callback);
    }
};

/**
 * Person methods
 * q = {query: id}
 **/
this.Person = {
    info: function(q, callback) {
        opts = {type: 'person', symbol: '?'};
        exports.fetchexternal(buildUrl(q,opts), callback);
    },
    credits: function(q, callback) {
        opts = {type: 'person', details: 'credits', symbol: '?'};
        exports.fetchexternal(buildUrl(q,opts), callback);       
    },
    images: function(q, callback) {
        opts = {type: 'person', details: 'images', symbol: '?'};
        exports.fetchexternal(buildUrl(q,opts), callback);       
    }
};

/**
 * Collection methods
 * q = {query: id}
 **/
this.Collection = {
    info: function(q, callback) {
        opts = {type: 'collection', symbol: '?'};
        exports.fetchexternal(buildUrl(q,opts), callback);
    }
};

this.fetchexternal = function(url,callback) {
    //console.log('Looking up url: '+url.url+'.');
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
