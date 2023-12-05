// script.js

// scroll effect
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

// selection effect
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

// page transitions + ChatGPT Requests
async function generateChatGPTResponse(background, selforg, counterorg) {
    const prompt = `Task: 
Given the context, counterparty and our organization, and three aspects that need to be addressed, please summarize the 1) position, 2) reasoning, and 3) motive and values for both parties.

With respect to counterparty, you should follow the logic of 1) articulate positions(what); 2) assess the tactical reasoning in support of positions from 1(how); 3) inner motives and values behind the reasoning from 2(why).With respect to our organization, you should follow a reversed logic, starting from motives and values(why), to reasoning(how), and to positions(what).

Next, interpret and summarize the convergent elements and divergent elements between both parties and list them separately into: 1) positions(what), 2) tactical reasoning in support of positions from 1(how), 3) motives and values behind the reasoning from 2(why)

All are in the format of bullet points for each aspect.

You may refer to the following questions to guide your summary.Make sure your summary is coherent with the context provided.

Guiding questions:
With respect to counterparty:
1) Position:
What are the counterparty's explicit positions(e.g., priorities and objectives) ?
What are the counterparty's implicit positions(e.g., attitude towards our organization, to what extent does the counterparty want to work with our organization)?
2) Tactical Reasoning:
Given the position derived above, what could be an explanation of the tactical reasoning of the counterpart to understand where they want to go with their position ?
3) Motives, Values & Identify:
Why does the counterparty take such positions ? What are their inner motives and values ?
What are the identity and cultural norms at play in the position of the counterpart and on which the counterpart often has little control ?

With respect to our organization:
1) Motives, Values & Identify:
Think about our identity, what are our inner principles, motives, and values ?
Why does our organization hope to operate in this particular context ?
2) Tactical Reasoning:
How do we intend to operate to ensure our goal is fulfilled and reach a maximized utility ?
3) Position:
What does our organization want out of this negotiation ?
What is our offer of service ?
What is the best -case scenario of an agreement with the counterparty ? Under what terms does our organization wish to operate ?

Context :
${background}

Counterparty: ${counterorg}
Our organization: ${selforg}
`;

    const apiURL = 'https://api.openai.com/v1/chat/completions';
    const apiKey = ''; // Replace with your actual API key

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,

    };

    const body1 = JSON.stringify({
        messages: [
            {
                "role": "system",
                "content": "You are a expert in negotiation, skilled in handling conflicts and difficult situations. You are a master of the art of persuasion.",
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
        model: 'gpt-3.5-turbo',
    });

    const response1 = await fetch(apiURL, {
        method: 'POST',
        headers: headers,
        body: body1
    });

    const data1 = await response1.json();
    const raw_content = data1.choices[0].message.content;

    const body2 = JSON.stringify({
        messages: [
            {
                "role": "user",
                "content": `Please parse the following string into a two-level json string. The three outer-most keys are [${counterorg}], [${selforg}], [convergent and divergent elements] . The three inner-most keys are [Position], [Tactical Reasoning], [Values & Motives].: ${raw_content}`,
            }
        ],
        model: 'gpt-3.5-turbo',
    });

    const response = await fetch(apiURL, {
        method: 'POST',
        headers: headers,
        body: body2
    });

    const data2 = await response.json();
    const final_response = data2.choices[0].message.content;
    // return final_response[`${selforg}`], final_response[`${counterorg}`], final_response["convergent and divergent elements"];
    return JSON.parse(final_response);

    // fetch(apiURL, {
    //     method: 'POST',
    //     headers: headers,
    //     body: body
    // })
    //     .then(response => response.json())
    //     .then(data => console.log(data))
    //     .catch(error => {
    //         console.error('Error:', error);
    //         // Handle the error appropriately
    //     });
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

var selforg;
var counterorg;
var background;

nextButton1.addEventListener("click", function () {
    selforg = document.getElementById('self-org-entry').value;
    counterorg = document.getElementById('counter-entry').value;

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

const nextButton2 = document.getElementById("nextButton-step2-text");

var gptResponse;
var selforgResponse;
var counterorgResponse;
var cssResponse;

nextButton2.addEventListener("click", async function () {
    nextButton2.classList.add('spinning');
    // Replace the button content with the spinning circle
    nextButton2.innerHTML = '<div class="spinner"></div>';
    background = document.getElementById('bg-entry').value;

    try {
        gptResponse = await generateChatGPTResponse(background, selforg, counterorg); // Call your actual async function here
        selforgResponse = gptResponse[`${selforg}`]
        counterorgResponse = gptResponse[`${counterorg}`]
        try {
            cssResponse = gptResponse["Convergent and Divergent Elements"]
        } catch (e) { }
        try {
            cssResponse = gptResponse["convergent and divergent elements"]
        } catch (e) { }
        console.log(gptResponse);
        console.log(selforgResponse);
        console.log(counterorgResponse);
        console.log(cssResponse);
    } catch (error) {
        console.error(error);
    } finally {
        // change display blocks
        nextButton2.classList.remove('spinning');
        nextButton2.innerText = 'Next';

        document.getElementById("step3-circle").style.backgroundColor = "#73C1D9";
        document.getElementById("step3-circle").style.opacity = "1";
        document.getElementById("step3-circle").style.border = "0";
        document.getElementById("step2-circle").style.backgroundColor = "#41575E";
        document.getElementById("step2-circle").style.opacity = "0.3";
        document.getElementById('step3-text').className = 'selected-circle-text';
        document.getElementById('step2-text').className = 'unselected-circle-text';

        document.getElementById("step2-page-text").style.display = "none";
        document.getElementById("step2-page-file").style.display = "none";

        document.getElementById("step3-page-iceberg").style.display = "block";
    }

});

const icebergSelf = document.getElementById("iceberg-self");
const positionText = document.getElementById("position-text");

icebergSelf.addEventListener("click", function () {
    document.getElementById("step3-page-iceberg").style.display = "none";
    document.getElementById("step3-page-results").style.display = "block";

    // document.getElementById("position-text").innerText = selforgResponse[];

});