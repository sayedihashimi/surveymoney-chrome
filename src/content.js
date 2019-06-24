debugger;
console.log("content script2 loaded");

function addButton() {
    var newTagElements = $("a:not([ce-processed])[ta-new-category-btn]");
    // first add the attribute to prevent duplication
    newTagElements.attr('ce-processed', '');

    $("<a class='wds-button wds-button--ghost wds-button--sm' href='#'>↑ Export tags</a>")
        .on("click", handleButtonClick)
        .insertAfter(newTagElements)
}

function registerDomWatcherToInsertElement() {
    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    var observer = new MutationObserver(function(mutations, observer) {
        // fired when a mutation occurs
        // console.log(mutations, observer);
        console.log('calling addButton')
        addButton();
    });
    // TODO: can this be fine tuned?
    observer.observe(document, {
        subtree: true,
        childList: true
    });
}

function copyToClipboard(text) {
    const input = document.createElement('input');
    input.style.position = 'fixed';
    input.style.opacity = 0;
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('Copy');
    document.body.removeChild(input);
};

function handleButtonClick(sender) {
    // get to the parent element that we need
    var targetParent = $(sender.target).closest('div[view-role="TaCategoriesPanel"]');

    var tagLabels = $(targetParent).find('a.ta-category-tag');
    var fullMessage = '';
    var tagInfo = []
    for (tag of tagLabels) {
        var percentage = $(tag).closest('div[class="sm-grid"]').find('div[class="ta-list-item-percentage"]').text();
        var count = $(tag).closest('div[class="sm-grid"]').find('div[class="ta-list-item-count"]').text();

        var tagObj = {
            "tag": $(tag).text(),
            "percentOverall": percentage,
            "count": count
        };
        tagInfo.push(tagObj);
        //var msg = $(tag).text() + '\t' + percentage + '\t' + count;
        //fullMessage += msg + '\n';
        //console.log(msg);
    }
    //alert(fullMessage);
    //copyToClipboard(fullMessage);
    showTagsInPopup(sender.target, tagInfo);
    return false;
}

function showTagsInPopup(exportButton, tagInfo) {
    var htmlToAdd = `
        <div id="tagsExport">
            <table id="tagsTable">
                <thead>
                    <tr>
                        <th>tag</th>
                        <th>% overall</th>
                        <th>count</th>
                    </tr>
                <thead>
                <tbody id="tagTableBody">
                    ${getTableElementsFor(tagInfo)}
                <tbody>
            </table>
        </div>
    `;

    $(htmlToAdd)
        .insertAfter($(exportButton));

    //     var tagTableBody = $("tagTableBody");
    //     for (tag of tagInfo) {
    //         var elementsToAdd = `
    //         <tr>
    //             <td>${tag.tag}</td>
    //             <td>${tag.percentOverall}%</td>
    //             <td>${tag.count}</td>
    //         </tr>
    // `;
    //         tagTableBody.append(elementsToAdd);
    //}



    /*
        $("<a class='wds-button wds-button--ghost wds-button--sm' href='#'>↑ Export tags</a>")
            .on("click", handleButtonClick)
            .insertAfter( newTagElements )
    */
}

function getTableElementsFor(tagInfo) {
    var result = '';
    for (tag of tagInfo) {
        result += `
        <tr>
            <td>${tag.tag}</td>
            <td>${tag.percentOverall}%</td>
            <td>${tag.count}</td>
        </tr>
`;
    }
    return result;
    //     var result = `
    //         <tr>
    //             <td>${tag.tag}</td>
    //             <td>${tag.percentOverall}%</td>
    //             <td>${tag.count}</td>
    //         </tr>
    // `;

    //     return result;
    //     s
}
async function extensionMain() {
    registerDomWatcherToInsertElement();
    addButton();

}

extensionMain();