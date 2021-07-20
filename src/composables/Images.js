import axios from "axios";
import { ref } from 'vue';
import config from "../config";

//set amount of columns
const colSize = 4;

export default function () {
    const images = ref([]);
    const scrollLoading = ref(false);
    const appendMain = ref(false);
    const inputView = ref(false);
    const loading = ref(false);
    const message = ref("WT");
    const page = ref(1)

    async function search(term = "", scrollLoad = false, newPage) {
        appendMain.value = false;
        page.value = newPage;
        message.value = "NT";
        // re-init page, set loading state, and cancel previous request(s) if not scroll
        if (scrollLoad === false) {
            loading.value = true;
        } else {
            scrollLoading.value = true;
        }
        //call api if search term, else clear image array and show default
        if (term !== "") {
            await fetchImages(term).then(() => {
                //disable loading and scrollLoading
                loading.value = false;
                scrollLoading.value = false;
            });
        } else {
            //clear images arr
            images.value = [];
            //hide gallery
            inputView.value = false;
            //disable loading and scrollloading
            loading.value = false;
            scrollLoading.value = false;
        }
    }

    //call api
    const fetchImages = (term) => {
        let cancelToken;
        //Check if there are any previous pending requests
        if (typeof cancelToken != typeof undefined) {
            cancelToken.cancel("Operation canceled due to new request.");
        }

        //Save the cancel token for the current request
        cancelToken = axios.CancelToken.source();
        //set headers
        const instance = axios.create({
            headers: { Authorization: `Client-ID ${config.client_id}` },
            cancelToken: cancelToken.token,
        });

        return instance
            .get(
                `https://api.imgur.com/3/gallery/search/${page.value}?q_any=${term}&q_size_px=med`
            )
            .then((response) => {
                //hide message
                inputView.value = true;

                // excludes videos and solves nested problem for albums 
                let newArr = filterArr(response.data.data);

                // if scroll query, add new results to old results. Else set new results
                newArr = chunkArray(newArr, Math.floor(newArr.length / colSize));

                // if scroll add to arr, else new arr
                if (page.value != 1) {
                    images.value = iterateAndPushToArr(images.value, newArr);
                } else {
                    images.value = newArr;
                }

                // if no results and not scrolling, set and append no results message, else if no results and scrolling, show end message
                if (newArr.length < 1) {
                    message.value = scrollLoading.value ? "ER" : "NR";
                    appendMain.value = true;
                }
            })
            .catch(function (error) {
                // handle error
                console.log("api", error);
            });
    };

    // create columns
    function chunkArray(array, size) {
        let result = [];
        //balances columns via jettisoning remainder. If needed, can add iteration to add them to start columns.
        for (let i = 0; i < array.length - (array.length % colSize); i += size) {
            let chunk = array.slice(i, i + size);
            result.push(chunk);
        }
        return result;
    }

    //solves video issue and nested album issue, standardizes array
    function filterArr(data) {
        let newArr = [];

        for (let i = 0; i < data.length; i++) {
            let image = getNestedOrRoot(data[i]);

            if (image.type !== "video/mp4") {
                let node = {
                    title: data[i].title,
                    author: data[i].account_url,
                    views: data[i].views,
                    id: image.id,
                    image: image,
                    tags: data[i].tags
                };
                newArr.push(node);
            }
        }
        return newArr;
    }

    function getNestedOrRoot(image) {
        if (image.images) return image.images[0];
        else return image;
    }

    function iterateAndPushToArr(oldArr, newArr) {
        if (newArr.length === 0) return oldArr;
        for (let i = 0; i < oldArr.length; i++) {
            oldArr[i] = oldArr[i].concat(newArr[i]);
        }
        return oldArr;
    }

    return { images, search, loading, inputView, appendMain, scrollLoading, message };
}