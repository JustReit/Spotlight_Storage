const tagList = document.getElementById('tag-list');
const AddTagIcon = document.getElementById('add_form_tag_toggle');
const filterIcon = document.getElementById('filter_tag_toggle');
const tagContainer = document.getElementById('add_form_tag_container');
const FilterTagContainer = document.getElementById('filter_tag_container');
const input = document.getElementById('tag-input');

let tags = [];
tagContainer.addEventListener('click', (event) => {
    const tagElement = event.target.closest('.tag');
    if (tagElement) {
        // Toggle the 'selected' class for the clicked tag
        tagElement.classList.toggle('selected');
         const selectedTags = applyTagFilter(tagContainer);
        localStorage.setItem('item_tags', JSON.stringify(selectedTags));
    }
});
tagList.addEventListener('click', (event) => {
    localStorage.removeItem('item_tags');
    const tagElement = event.target;

    if (tagElement.classList.contains('tag')) {
        // Toggle the 'selected' class for the clicked tag
        tagElement.classList.toggle('selected');
        const filter = applyTagFilter(tagList);
        const items = Array.from(itemList.children);
        Array.from(items).forEach((item) => {
            const itemTags = item.dataset.tags;
            const cleanedTags = itemTags.replace(/[\[\]'"`]/g, ''); // Remove square brackets, single quotes, double quotes, and backticks
            const itemTagsArray = cleanedTags.split(',');
            let shouldDisplay = true;
            if (filter.length > 0) {
                // Check if all filters are present in itemTagsArray
                filter.forEach(searchText => {
                    const searchTextLower = searchText.toLowerCase();

                    if (!itemTagsArray.some(itemTag => itemTag.toLowerCase().includes(searchTextLower))) {
                        shouldDisplay = false;
                    }
                });
            }
            if (shouldDisplay) {
                item.style.display = "flex";
            } else {
                item.style.display = "none";
            }
        });
    }
});
function resetTagSelection() {
    const allTags = tagContainer.querySelectorAll('.tag');
    allTags.forEach((tag) => {
        tag.classList.remove('selected');
    });
    applyTagFilter(tagContainer)
}
function PopulateTagSelection(itemTagsArray){
    const allTags = Array.from(tagContainer.getElementsByClassName('tag'));
    console.log('allTags', allTags)
    allTags.forEach(tagElement => {
        console.log('tagElement', tagElement)
            const tag = tagElement.innerHTML;
            console.log('tag', tag)
            // Check if the tag is in itemTagsArray
            if (itemTagsArray.includes(tag)) {
                tagElement.classList.add('selected');
                applyTagFilter(tagContainer);
            }
    });
    const computedStyle = window.getComputedStyle(tagContainer);
    if (computedStyle.display === "none") {
        tagContainer.classList.toggle('hidden');
        AddTagIcon.innerHTML = 'filter_list_off';
    }
    else{
        tagContainer.classList.toggle('hidden');
        AddTagIcon.innerHTML ='filter_list';
    }
}
// Updated applyTagFilter to log immediately after tag click
function applyTagFilter(container) {
    const allTags = Array.from(container.getElementsByClassName('tag'));
    const selectedTags = [];
    let tag = "";
    // Iterate through all tags
    allTags.forEach(tagElement => {
        if(container === tagContainer){
        tag = tagElement.innerHTML;}else{
            tag = tagElement.querySelector('span').getAttribute('data-item')
        }

        // Check if the tag is selected
        if (tagElement.classList.contains('selected')) {
            selectedTags.push(tag);

            tagElement.style.backgroundColor = '#1D4ED8FF'; // Dark blue background color for selected tags
        } else {
            tagElement.style.backgroundColor = ''; // Reset background color for unselected tags
        }
    });
    localStorage.removeItem('item_tags');
    localStorage.setItem('item_tags', JSON.stringify(selectedTags));
    console.log('selectedTags', selectedTags);
    return selectedTags


}
function loadTags() {
    resetTags();
    localStorage.removeItem('item_tags');
    // Fetch the settings from the server
    fetch("/api/tags")
        .then((response) => response.json())
        .then((tagdata) => {
            console.log(tagdata);
            tagdata.forEach(({ tag, count }) => {
                const input = createTag(tag, count);
                tagContainer.append(input);
                tags.push(tag);
            });

        })
        .catch((error) => console.error(error));

}
function createTag(tag, count){
    const FilterTag = document.createElement('div');
    FilterTag.classList.add('tag');
    FilterTag.innerHTML = tag;
    const div = document.createElement('div');
    div.classList.add('tag');
    div.innerHTML = tag;
    const TagCount = document.createElement('span');
    TagCount.setAttribute('data-item', tag);
    TagCount.innerHTML = count;
    TagCount.classList.add("text-gray-500")
    TagCount.style.marginLeft = '10px';
    div.appendChild(TagCount);
    FilterTag.appendChild(TagCount);
    tagList.appendChild(FilterTag);
    return div;
}
function resetTags(){
    document.querySelectorAll('.tag').forEach(function (tag)
    {
        tag.parentElement.removeChild(tag);
    })
}
function addTags(tagData){
        const  input = createTag(tagData, 1);
        tagContainer.append(input)
}
input.addEventListener('keyup', function (e){
    if (e.key === 'Enter' && input.value !=='') {
        const computedStyle = window.getComputedStyle(tagContainer);
        if (computedStyle.display === "none") {
            // Toggle the visibility of the tag container
            tagContainer.classList.toggle('hidden');
        }
        const newTag = input.value;
        tags.push(newTag);
        addTags(newTag)
        input.value = '';
    }
})
loadTags();
AddTagIcon.addEventListener('click', function () {
    const computedStyle = window.getComputedStyle(tagContainer);
    if (computedStyle.display === "none") {
        tagContainer.classList.toggle('hidden');
        AddTagIcon.innerHTML = 'filter_list_off';
    }
    else{
        tagContainer.classList.toggle('hidden');
        AddTagIcon.innerHTML ='filter_list';
    }
});

filterIcon.addEventListener('click', function () {
    const computedStyle = window.getComputedStyle(FilterTagContainer);
    if (computedStyle.display === "none") {
        FilterTagContainer.classList.toggle('hidden');
        filterIcon.innerHTML = 'filter_list_off';
        loadTags();
    }
    else{
        FilterTagContainer.classList.toggle('hidden');
        filterIcon.innerHTML ='filter_list';
    }

});