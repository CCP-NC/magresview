// Google analytics code

// Launch Google Analytics
function ga_activate() {
    window['ga-disable-UA-109654211-1'] = false;
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());

    gtag('config', 'UA-109654211-1', { 'anonymize_ip': true }); // Anonymize IPs
}

// Clean up all Google Analytics cookies
function ga_clean() {
    window['ga-disable-UA-109654211-1'] = true; // Disable tracking

    var ck = Cookies.get();

    for (var c in ck) {
        if ('_ga' === c || '_gid' === c || c.includes('_gat')) {
            Cookies.remove(c, { path: '/', domain: document.location.hostname });
        }
    }
}

// Callback for cookie popup
function cookie_callback(status, chosenBefore) {
    var type = this.options.type;
    var didConsent = this.hasConsented();
    if (didConsent) {
        if (document.location.hostname != 'localhost') {
            // No point activating it otherwise...
            ga_activate();
        }
    }
    else {
        ga_clean();
    }
}