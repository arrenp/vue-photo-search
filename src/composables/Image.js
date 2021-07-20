import { ref } from "vue";

export default function () {
    const compressedImg = ref("");
    const isModalCard = ref(false);
    //max for scale calculation
    const max = ref({
        width: window.innerWidth < 600 ? 320 : 210,
        height: window.innerHeight - window.innerHeight * 0.1,
    });

    //resize img based on current screen
    async function getCompressedImage(link, isModal) {
        isModalCard.value = isModal
        Promise.resolve(
            fetch(link).then(processImageResponse).then(ResizeImage)
        );
    }


    async function processImageResponse(response) {
        const blob = await response.blob();
        return blob;
    }

    async function ResizeImage(response) {
        const reader = new FileReader();
        reader.readAsDataURL(response);

        reader.onload = function (event) {
            const imgElement = document.createElement("img");
            imgElement.src = event.target.result;

            imgElement.onload = function (e) {
                const canvas = document.createElement("canvas");

                // if mobile or modal card, scale by height, else scale by width
                if (!isModalCard.value) {
                    scaleDimensions(canvas, e.target);
                } else {
                    scaleDimensions(canvas, e.target, "height", "width");
                }

                const ctx = canvas.getContext("2d");

                ctx.drawImage(e.target, 0, 0, canvas.width, canvas.height);

                const srcEncoded = ctx.canvas.toDataURL(e.target, "image/jpeg");
                compressedImg.value = srcEncoded;
            };
        };
    }

    function scaleDimensions(
        canvas,
        target,
        dim = "width",
        otherDim = "height"
    ) {
        let scaleSize = max.value[dim] / target[dim];
        canvas[dim] = max.value[dim];
        canvas[otherDim] = target[otherDim] * scaleSize;
        return canvas;
    }

    return { compressedImg, getCompressedImage };
}