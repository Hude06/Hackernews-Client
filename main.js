let window_increment = 1;
let popup_window = document.getElementById("popup");
let popup_content = document.getElementById("popup-content");
let feed = document.getElementById("feed");
let back = document.getElementById("back");
let menubar = document.getElementById("menubar");
back.style.display = "none";
function decodeAndProcessText(encodedText) {
    // Decode HTML entities
    const decoder = new DOMParser();
    const doc = decoder.parseFromString(encodedText, 'text/html');
    const decodedText = doc.body.textContent;

    // Process the decoded text

    // Output identifiers found
    return decodedText
    console.log(decodedText);
}
async function popup(data, kids) {
    console.log(data);
    console.log('array');
    // clear the popup_content div
    // while (popup_content.firstChild) {
    //     popup_content.removeChild(popup_content.firstChild);
    // }
    popup_content.innerHTML = "";
    for (let i = 0; i < kids.length; i++) {
        if (kids[i]) {
            back.style.display = "flex";
            if (kids[i].type === "comment") {
                let decoded_text = decodeAndProcessText((kids[i]).text);
                console.log("comment");
                const newH3 = document.createElement("h3");
                newH3.classList.add("commentH3");
                newH3.textContent = kids[i].by;
                popup_content.appendChild(newH3);
                let pTAG = document.createElement("p");
                pTAG.classList.add("commentP");
                pTAG.textContent = decoded_text
                console.log(pTAG.textContent);
                popup_content.appendChild(pTAG);
            }
        }
    }

    popup_window.style.display = "flex";
    feed.style.display = "none";

    let existingH1 = menubar.querySelector("h1");
    if (existingH1) {
        existingH1.textContent = data.title;
    } else {
        const newH1 = document.createElement("h1");
        newH1.textContent = data.title;
        menubar.appendChild(newH1);
    }
}

back.addEventListener("click", function() {
    popup_window.style.display = "none";
    feed.style.display = "flex";
    back.style.display = "none";
});

async function createPostElement(id) {
    let data = await id_to_post(id);
    if (!data) return;

    const newPostDiv = document.createElement('div');
    newPostDiv.classList.add('post');

    // const newH3 = document.createElement('h3');
    const newH3_1 = document.createElement('h3');
    const newH3 = document.createElement('h3');
    window.innerWidth;
    let line = "";
    for (let i = 0; i < window.innerWidth/9; i++) {
        line += "-"
    }
    newH3.textContent = line;
    newH3.classList.add('LINE');
    newH3_1.textContent = data.title;
    newH3_1.classList.add('title');
    newPostDiv.appendChild(newH3_1);
    newPostDiv.appendChild(newH3);

    newPostDiv.addEventListener("click", async function() {
        // Fetch each kid's data
        let kidsData = [];
        if (Array.isArray(data.kids)) {
            const kidsPromises = data.kids.map(kid => id_to_post(kid));
            kidsData = await Promise.all(kidsPromises);
        }
        await popup(data, kidsData);
    });

    feed.appendChild(newPostDiv);
}

async function fetchData() {
    try {
        const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty');
        const data = await response.json();
        
        // Fetch all post data concurrently
        const postPromises = data.slice(0, 30).map(id => createPostElement(id));
        await Promise.all(postPromises);
        
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function id_to_post(id) {
    try {
        const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

fetchData();
