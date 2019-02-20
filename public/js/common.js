function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

var garbageBin;

function discardElement(element) {
    console.warn("--- discardElement ---");
    if (typeof (garbageBin) === 'undefined') {
        //Here we are creating a 'garbage bin' object to temporarily 
        //store elements that are to be discarded
        garbageBin = document.createElement('div');
        garbageBin.classList.add("garbageBin");
        garbageBin.style.display = 'none'; //Make sure it is not displayed
        document.body.appendChild(garbageBin);
    }
    console.warn(element);
    console.warn(garbageBin);
    //The way this works is due to the phenomenon whereby child nodes
    //of an object with it's innerHTML emptied are removed from memory

    //Move the element to the garbage bin element
    garbageBin.appendChild(element);
    //Empty the garbage bin
    garbageBin.innerHTML = "";
    element = null;
}