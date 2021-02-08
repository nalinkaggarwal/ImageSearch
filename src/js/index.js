var currentPageSize = 1;
var pageSize = 250;
var totalPages = 0;
let currentscrollheight = 0;
function getData(word, isDataAppend = true) {

    setCookies(word);
    let xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.open("Get", "https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=60f47f99489bdfb72d997973d85d0b48&text=" + word + "&per_page="+pageSize+"&page="+currentPageSize+"&format=json&nojsoncallback=1");
    xmlHttpRequest.send();
    xmlHttpRequest.onload = () => {
        if (xmlHttpRequest.status === 200) {
            PaintData(JSON.parse(xmlHttpRequest.response), isDataAppend);
        }
        else {
            console.log(xmlHttpRequest);
        }
    }
}

function onKeyInput(value) {
    if (value) {
        getData(value);
    }
}

function PaintData(data, isDataAppend) {
    var photos = data.photos.photo;
    let parentElement = document.getElementById("resultBody");
    let element;
    if (isDataAppend) {
        currentscrollheight = 0;
        console.log("remove");
        removeChildNode("resultBody");
        element = document.createElement("div");
        element.setAttribute("id", "result");
    }
    else
    {
        element = document.getElementById("result");
    }
    
    for (let i = 0; i < photos.length; i++) {
        let photoDiv = "";
        let src = 'https://live.staticflickr.com/' + photos[i].server + '/' + photos[i].id + '_' + photos[i].secret;
        const string = JSON.stringify(photos[i]);
        let oImg = document.createElement("img");
        oImg.setAttribute('src', src + '_t.jpg');
        oImg.setAttribute('class', "img-thumbnail mx-2");
        oImg.setAttribute('data-bs-toggle', "modal");
        oImg.setAttribute('data-bs-target', "#exampleModal");
        oImg.addEventListener('click', function () {
            showImageMetaData(photos[i], src);
        }, false);

        //photoDiv += `<img class="img-thumbnail mx-2" onclick="showImageMetaData('','b')" data-bs-toggle="modal" data-bs-target="" src='${src}'>`;
        element.appendChild(oImg);
    }
    parentElement.appendChild(element);
    //element.innerHTML = photoDivs;
}

function setCookies(value) {
    document.cookie = "searchText=" + value + "; path=/";;
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function getDefaultSearch() {
    let value = getCookie("searchText");
    if (value) {
        (document.getElementById('searchTextBox')).value = value;
        getData(value);
    }
}

function showImageMetaData(photoObj, imgUrl) {
    getImageDate(photoObj, imgUrl);
}

function getImageDate(photoObj, imgUrl) {

    let xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.open("Get", "https://www.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=60f47f99489bdfb72d997973d85d0b48&photo_id=" + photoObj.id + "&secret=" + photoObj.secret + "&format=json&nojsoncallback=1");
    xmlHttpRequest.send();
    xmlHttpRequest.onload = () => {
        if (xmlHttpRequest.status === 200) {
            let dataInfo = JSON.parse(xmlHttpRequest.response);
            console.log(dataInfo.photo);
            let oImg = document.createElement("img");
            oImg.setAttribute('src', imgUrl + '_w.jpg');
            oImg.setAttribute('class', "img-thumbnail mx-2");
            let imageChild = document.getElementById('image-lg-div');
            (imageChild).appendChild(oImg);
            document.getElementById('title').textContent = "Title : " + dataInfo.photo.title._content;
            document.getElementById('description').innerHTML = "Description : <br/>" + dataInfo.photo.description._content;
            document.getElementById('authorDetails').textContent = "Posted By : " + dataInfo.photo.owner.realname;
        }
        else {
            console.log(xmlHttpRequest);
        }
    }

}

function removeChildNode(id) {
    let imageChild = document.getElementById(id);
    if (imageChild && imageChild.childElementCount > 0) {
        (imageChild).removeChild(imageChild.lastElementChild);
    }
}

window.onload = () => {
   
    getDefaultSearch();
    document.addEventListener("scroll", () => {
        console.log("out");
        let scrollheight = document.body.scrollHeight;
        let scrollposition = Math.floor(screen.height + document.documentElement.scrollTop);
        let isBottom = (scrollheight - 295) < scrollposition;
        //console.log(scrollposition, scrollheight, scrollposition - scrollheight);
        if (isBottom && currentscrollheight < scrollheight) {
            console.log('in');
            currentscrollheight = scrollheight;
            let text = document.getElementById('searchTextBox').value;
            currentPageSize++;
            getData(text, false);
        }
    });
}

function scroll() {


}
