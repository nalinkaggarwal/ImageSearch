export default class HttpRequest {

    constructor() {
        this.apiUrl = "https://www.flickr.com/services/rest/?method=";
    }

    Get(methodName, queryParams) {
        return new Promise((resolve, reject) => {
            let xmlHttpRequest = new XMLHttpRequest();
            xmlHttpRequest.open("Get", this.apiUrl + methodName + "&api_key=60f47f99489bdfb72d997973d85d0b48&" + queryParams + "&format=json&nojsoncallback=1");
            xmlHttpRequest.onload = () => {
                if (xmlHttpRequest.status >= 200 && xmlHttpRequest.status < 300) {
                    resolve(xmlHttpRequest.response);
                }
                else {
                    reject({
                        status: xmlHttpRequest.status,
                        statusText: xmlHttpRequest.statusText
                    });
                }
            }
            xmlHttpRequest.onerror = function () {
                reject({
                    status: xmlHttpRequest.status,
                    statusText: xmlHttpRequest.statusText
                });
            };
            xmlHttpRequest.send();
        });
    }
}