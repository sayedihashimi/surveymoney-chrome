//debugger;
console.log("content script2 loaded");

function addButton(){
    var newTagElements = $("a:not([ce-processed])[ta-new-category-btn]");
    // first add the attribute to prevent duplication
    newTagElements.attr('ce-processed','');

    $("<a class='wds-button wds-button--ghost wds-button--sm' href='#'>↑ Export tags</a>")
        .on("click", handleButtonClick)
        .insertAfter( newTagElements )
}

function registerDomWatcherToInsertElement() {
    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    var observer = new MutationObserver(function (mutations, observer) {
        // fired when a mutation occurs
        // console.log(mutations, observer);
        console.log('calling addButton')
        addButton();
    });
    // TODO: can this be fine tuned?
    observer.observe(document, {
        subtree: true,
        childList:true
    });
}

function handleButtonClick(sender){
    alert('button clicked');
}

async function extensionMain() {
    registerDomWatcherToInsertElement();
    addButton();
    
}

extensionMain();