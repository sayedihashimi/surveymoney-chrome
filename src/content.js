debugger;
console.log("content script2 loaded");


function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    //textarea.style.position = 'fixed';
    textarea.style.opacity = 0;
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('Copy');
    document.body.removeChild(textarea);
};

function addExportTagsButton() {
    var newTagElements = $("a:not([ce-processed])[ta-new-category-btn]");
    // first add the attribute to prevent duplication
    newTagElements.attr('ce-processed', '');

    pauseMutationObserver();
    $("<a class='wds-button wds-button--ghost wds-button--sm' href='#'>↑ Export tags</a>")
        .on("click", handleExportTagsButtonClick)
        .insertAfter(newTagElements)
    enableMutationObserver();
}
var observer;

function enableMutationObserver() {
    registerDomWatcherToInsertElement();
}

function pauseMutationObserver() {
    if (observer == null) { return; }

    observer.disconnect();
}

function registerDomWatcherToInsertElement() {
    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    if (observer == null) {
        observer = new MutationObserver(function(mutations, observer) {
            // fired when a mutation occurs
            console.log('dom mutated, adding elements');
            addExportTagsButton();
            addExportResponsesWithTagsButton();
        });
    }
    // TODO: can this be fine tuned?
    observer.observe(document, {
        subtree: true,
        childList: true
    });
}

function handleExportTagsButtonClick(sender) {
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
    }
    showTagInfo(sender.target, tagInfo);
    return false;
}

function showTagInfo(exportButton, tagInfo) {
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

    // remove tagsExport if it exists
    $("#tagsExport").remove();

    pauseMutationObserver();
    $(htmlToAdd)
        .insertAfter($(exportButton));
    enableMutationObserver();

    copyToClipboard(getStringFor(tagInfo));
}

function getStringFor(tagInfo) {
    var result = 'tag' + '\t' + 'percent overall' + '\t' + 'count' + '\n';
    for (tag of tagInfo) {
        result += tag.tag + '\t' + tag.percentOverall + '\t' + tag.count + '\n';
    }
    return result;
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
}

/* related to ExportResponsesWithTags */
function addExportResponsesWithTagsButton() {
    // The tab that is named TAGS(##)
    var tagsElement = $('div:not([ce-processed])[view-role="TaTabsView"]>nav[ta-tabs-nav]>a:not([ce-processed]):last-of-type');
    // first add the attribute to prevent duplication
    tagsElement.attr('ce-processed', '');

    pauseMutationObserver();
    $("<a ce-processed class='wds-button wds-button--ghost wds-button--sm' href='#' style='color:red'>↑ Export responses with tags</a>")
        .on("click", handleExportResponsesWithTagsClick)
        .insertAfter(tagsElement)
    enableMutationObserver();
}

function handleExportResponsesWithTagsClick(sender) {
    alert('foo');
}

async function extensionMain() {
    registerDomWatcherToInsertElement();
    addExportTagsButton();
    addExportResponsesWithTagsButton();
}

extensionMain();