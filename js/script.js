// script.js
document.addEventListener('DOMContentLoaded', function () {
    const scrollButton = document.getElementById('scrollButton');
    const targetDiv = document.getElementById('response-box');

    scrollButton.addEventListener('click', function () {
        targetDiv.scrollIntoView({
            behavior: 'smooth', // Enable smooth scrolling
            block: 'end', // Scroll to the end of the target div
            inline: 'nearest' // Scroll to the nearest edge of the target div
        });
    });
});

let selectedOption = null;

function toggleSelection(option) {
    const innerCircle = option.querySelector('.inner-circle');
    const optionText = option.querySelector('.option-text');
    const outerCircle = option.querySelector('.circle');

    if (selectedOption) {
        const prevInnerCircle = selectedOption.querySelector('.inner-circle');
        const prevOptionText = selectedOption.querySelector('.option-text');
        const prevOuterCircle = selectedOption.querySelector('.circle');

        prevInnerCircle.style.display = 'none';
        prevOptionText.classList.remove('selected');
        prevOuterCircle.classList.remove('selected');
    }

    innerCircle.style.display = 'block';
    optionText.classList.add('selected');
    outerCircle.classList.add('selected');
    selectedOption = option;
}

const fileUploadOption = document.getElementById('file-upload-option');
const textEntryOption = document.getElementById('text-entry-option');

fileUploadOption.addEventListener("click", function () {
    toggleSelection(fileUploadOption);
});

textEntryOption.addEventListener("click", function () {
    toggleSelection(textEntryOption);
});

const fileUpload = document.getElementById('file-upload-option');
const textEntry = document.getElementById('text-entry-option');
const nextButton1 = document.getElementById("nextButton-step1");


nextButton1.addEventListener("click", function () {
    if (selectedOption === fileUploadOption) {
        // Clear the existing content
        document.getElementById("step2-circle").style.backgroundColor = "#73C1D9";
        document.getElementById("step2-circle").style.opacity = "1";
        document.getElementById("step2-circle").style.border = "0";
        document.getElementById("step1-circle").style.backgroundColor = "#41575E";
        document.getElementById("step1-circle").style.opacity = "0.3";
        document.getElementById('step2-text').className = 'selected-circle-text';
        document.getElementById('step1-text').className = 'unselected-circle-text';

        console.log("FileUpload selected")
        document.getElementById("step1-page").style.display = "none";
        document.getElementById("step2-page-file").style.display = "block";

        const fileUploadContainer = document.getElementById("fileUploadContainer");
        const fileInput = document.getElementById("fileInput");

        // Add drag and drop functionality
        fileUploadContainer.addEventListener("dragover", function (e) {
            e.preventDefault();
            fileUploadContainer.classList.add("dragover");
        });

        fileUploadContainer.addEventListener("dragleave", function (e) {
            e.preventDefault();
            fileUploadContainer.classList.remove("dragover");
        });

        fileUploadContainer.addEventListener("drop", function (e) {
            e.preventDefault();
            fileUploadContainer.classList.remove("dragover");
            const files = e.dataTransfer.files;
            handleFiles(files);
        });

        fileInput.addEventListener("change", function (e) {
            const files = e.target.files;
            handleFiles(files);
        });

        function handleFiles(files) {
            // Handle uploaded files here
            console.log(files);

            // Show the progress bar
            progressContainer.style.display = "flex";

            // Simulate uploading progress (remove this for actual use)
            simulateUpload(files);
        }

        function simulateUpload(files) {
            let progress = 0;
            const interval = 100; // Update progress every 100ms

            const updateProgress = () => {
                progress += 1;
                progressFill.style.width = progress + "%";

                if (progress < 100) {
                    setTimeout(updateProgress, interval);
                } else {
                    // Upload completed, you can perform further actions here
                }
            };

            updateProgress();
        }
    };

    if (selectedOption === textEntryOption) {
        // Clear the existing content
        document.getElementById("step2-circle").style.backgroundColor = "#73C1D9";
        document.getElementById("step2-circle").style.opacity = "1";
        document.getElementById("step2-circle").style.border = "0";
        document.getElementById("step1-circle").style.backgroundColor = "#41575E";
        document.getElementById("step1-circle").style.opacity = "0.3";
        document.getElementById('step2-text').className = 'selected-circle-text';
        document.getElementById('step1-text').className = 'unselected-circle-text';

        console.log("TextEntry selected")
        document.getElementById("step1-page").style.display = "none";
        document.getElementById("step2-page-text").style.display = "block";
    };

});


const backButtonFile = document.getElementById("backButton-step2-file");

backButtonFile.addEventListener("click", function () {
    // Clear the existing content
    document.getElementById("step2-page-text").style.display = "none";
    document.getElementById("step2-page-file").style.display = "none";

    document.getElementById("step1-page").style.display = "block";

    document.getElementById("step1-circle").style.backgroundColor = "#73C1D9";
    document.getElementById("step1-circle").style.opacity = "1";
    document.getElementById("step1-circle").style.border = "0";
    document.getElementById("step2-circle").style.backgroundColor = "#41575E";
    document.getElementById("step2-circle").style.opacity = "0.3";
    document.getElementById('step1-text').className = 'selected-circle-text';
    document.getElementById('step2-text').className = 'unselected-circle-text';

});

const backButtonText = document.getElementById("backButton-step2-text");

backButtonText.addEventListener("click", function () {
    // Clear the existing content
    document.getElementById("step2-page-text").style.display = "none";
    document.getElementById("step2-page-file").style.display = "none";

    document.getElementById("step1-page").style.display = "block";

    document.getElementById("step1-circle").style.backgroundColor = "#73C1D9";
    document.getElementById("step1-circle").style.opacity = "1";
    document.getElementById("step1-circle").style.border = "0";
    document.getElementById("step2-circle").style.backgroundColor = "#41575E";
    document.getElementById("step2-circle").style.opacity = "0.3";
    document.getElementById('step1-text').className = 'selected-circle-text';
    document.getElementById('step2-text').className = 'unselected-circle-text';

});