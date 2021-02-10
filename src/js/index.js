import ImageSearch from "./ImageSearch";

window.onload = () => {
    const imageSearch = new ImageSearch();
    imageSearch.getDefaultSearch();

    const removeImage = () => imageSearch.removeChildNode('image-lg-div');
    document.addEventListener("scroll", () => imageSearch.setVirtualScroll());
    document.getElementById("searchTextBox").addEventListener("input", event => imageSearch.autoCompleteSearch(event.target.value));
    document.getElementById("modal-close").addEventListener("click", removeImage);
    document.getElementById("button-close").addEventListener("click", removeImage);
}