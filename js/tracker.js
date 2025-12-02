(function() {
    // Find the script element that loaded this code
    var scriptEl = document.currentScript;
    
    // Fallback for async loading if currentScript is not available
    if (!scriptEl) {
        var scripts = document.getElementsByTagName('script');
        for (var i = 0; i < scripts.length; i++) {
            if (scripts[i].src && scripts[i].src.indexOf('/js/tracker.js') !== -1) {
                scriptEl = scripts[i];
                break;
            }
        }
    }

    // 1. Try to get base URL from data-host attribute (Best for static sites/Github Pages)
    // Example: <script src="tracker.js" data-host="https://my-analytics-api.com"></script>
    var baseUrl = '';
    if (scriptEl && scriptEl.getAttribute('data-host')) {
        baseUrl = scriptEl.getAttribute('data-host');
    } 
    // 2. Try to derive from script src
    else if (scriptEl && scriptEl.src) {
        var src = scriptEl.src;
        if (src.indexOf('/js/tracker.js') !== -1) {
            baseUrl = src.substring(0, src.indexOf('/js/tracker.js'));
        }
    }

    // Ensure baseUrl doesn't end with slash
    if (baseUrl.endsWith('/')) {
        baseUrl = baseUrl.slice(0, -1);
    }

    var page = window.location.href;
    var referer = document.referrer;
    
    // Construct the tracking URL
    var hitUrl = baseUrl + '/hit?page=' + encodeURIComponent(page) + '&referer=' + encodeURIComponent(referer);

    // Send the tracking request
    fetch(hitUrl, {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit'
    })
    .then(response => {
        if (!response.ok) {
            console.warn('Analytics tracking failed:', response.status);
        }
    })
    .catch(err => console.warn("Analytics tracking error:", err));
})();