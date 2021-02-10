import HttpRequest from "./HttpRequest";
import Helpers from "./utils/Helpers";

export default class ImageSearch {
    
    constructor(currentPageSize = 1, pageSize = 250) {
        this.currentPageSize = currentPageSize;
        this.pageSize = pageSize;
        this.totalPages = 0;
        this.currentscrollheight = 0;
    }

    async autoCompleteSearch(text, isAppend = true) {
        Helpers.setCookies(text);
        if (text) {
            const queryParam = `text=${text}&per_page=${this.pageSize}&page=${this.currentPageSize}`;
            const req = new HttpRequest();
            const result = await req.Get("flickr.photos.search", queryParam);

            // paint search reult into DOM
            this.paintData(result, isAppend);
        }
        else {
            // if empty text passed, remove the result
            this.removeChildNode("resultBody");
        }
    }

    paintData(data, isDataAppend) {
        const photos = (JSON.parse(data)).photos.photo;
        const parentElement = document.getElementById("resultBody");
        let element;
        if (isDataAppend) {
            this.currentscrollheight = 0;
            this.removeChildNode("resultBody");
            element = document.createElement("div");
            element.setAttribute("id", "result");
        }
        else {
            element = document.getElementById("result");
        }
        const baseUrlPath = "https://live.staticflickr.com/";
        for (let i = 0; i < photos.length; i++) {
            // As images is statically saved , so creating the url to grab the images
            const src = `${baseUrlPath}${photos[i].server}/${photos[i].id}_${photos[i].secret}`;
            
            let oImg = document.createElement("img");
            oImg.setAttribute('src', `${src}_t.jpg`);
            oImg.setAttribute('class', "img-thumbnail mx-2 mb-2");
            oImg.setAttribute('style', "cursor:pointer");
            oImg.setAttribute('data-bs-toggle', "modal");
            oImg.setAttribute('data-bs-target', "#exampleModal");
            oImg.addEventListener('click', ()=> (this.showImageMetaData(photos[i], src)), false);
            element.appendChild(oImg);
        }
        parentElement.appendChild(element);
    }

    getDefaultSearch() {
        const value = Helpers.getCookie("searchText");
        if (value) {
            (document.getElementById("searchTextBox")).value = value;
            this.autoCompleteSearch(value);
        }
    }

    showImageMetaData(photoObj, imgUrl) {
        this.getImageDate(photoObj, imgUrl);
    }

    async getImageDate(photoObj, imgUrl) {
        const req = new HttpRequest();
        const result = await req.Get("flickr.photos.getInfo", `photo_id=${photoObj.id}&secret=${photoObj.secret}`);
        const dataInfo = JSON.parse(result);

        let oImg = document.createElement("img");
        oImg.setAttribute('src', imgUrl + '_w.jpg');
        oImg.setAttribute('class', "img-thumbnail mx-2");

        let imageChild = document.getElementById('image-lg-div');
        (imageChild).appendChild(oImg);
        document.getElementById('title').textContent = "Title : " + dataInfo.photo.title._content;
        document.getElementById('description').innerHTML = "Description : <br/>" + dataInfo.photo.description._content;
        document.getElementById('authorDetails').textContent = "Posted By : " + dataInfo.photo.owner.realname;
    }

    removeChildNode(id) {
        const imageChild = document.getElementById(id);
        if (imageChild && imageChild.childElementCount > 0) {
            (imageChild).removeChild(imageChild.lastElementChild);
        }
    }

    setVirtualScroll() {
        // check if scoll ended or not
        if (this.isScrollEnd()) {
            const text = document.getElementById('searchTextBox').value;
            this.autoCompleteSearch(text, false);
        }
    }

    isScrollEnd() {
        const scrollheight = document.body.scrollHeight;
        // getting current scroll position
        const scrollposition = Math.floor(screen.height + document.documentElement.scrollTop);
        const isBottom = (scrollheight - 295) < scrollposition;
        if (isBottom && this.currentscrollheight < scrollheight) {
            this.currentscrollheight = scrollheight;
            this.currentPageSize++;
            return true;
        }
        return false;
    }
}
