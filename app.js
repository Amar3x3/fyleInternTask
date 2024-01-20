// script.js
// // script.js
// JavaScript (script.js)
const repoContainer = document.getElementById('repos-list');
const totalPagesContainer = document.getElementById('total-pages');
const paginationContainer = document.getElementById('pagination');
let currentPage = 1;
var totalRepos;
var repositories_json;
var username='johnpapa';
const go = document.querySelector('.search-go');

go.addEventListener('click',()=>{
    console.log("go")
    const user = document.getElementById('gitUserName');
    doesUserExist(user.value);
})

async function doesUserExist(user) {
    const apiUrl = `https://api.github.com/users/${user}`;
    
    try {
        const response = await fetch(apiUrl);
        
     
        if (response.ok) {
            username = user;
            Repositories(username,10);
            UserProfile(username); 
        } else if (response.status === 404) {
           alert("Username is not valid please try again");
        } else {
            throw new Error(`Unexpected response: ${response.status}`);
        }
    } catch (error) {
        console.error('Error checking user existence:', error.message);
        return false; 
    }
}


async function fetchRepositories(user, page, perPage) {
    const apiUrl = `https://api.github.com/users/${user}/repos?page=${page}&per_page=${perPage}`;
    const response = await fetch(apiUrl);
    const repositoriesFetched = await response.json();
    console.log(repositoriesFetched);
    return repositoriesFetched;
}

//Pagination function
function renderPagination(totalPages, onPageChange) {
    const paginationContainer = document.getElementById('pagination');

    // Clear previous pagination
    paginationContainer.innerHTML = '';

    // Create page number links
    for (let page = 1; page <= totalPages; page++) {
        const pageLink = document.createElement('a');
        pageLink.classList.add('pages')
        pageLink.href = '#';
        pageLink.textContent = page;
        pageLink.addEventListener('click', function () {
           
            document.querySelectorAll('.pages').forEach(link => {
                link.classList.remove('active');
            });

            pageLink.classList.add('active');

            // When a page is clicked, execute the provided callback
            onPageChange(page);
        });
        if (page === currentPage) {
            console.log("triggered");
            pageLink.classList.toggle('active'); // Highlight the current page
        }
        paginationContainer.appendChild(pageLink);
    }
}


async function Repositories(user, perPage) {
     repositories_json = await fetchRepositories(user, currentPage, perPage);
    const repoList = document.querySelector(".cards-list");

    repoList.innerHTML='';

   
    const totalPages = Math.ceil(totalRepos / perPage);

    

    // Function to render repositories for a specific page
    function renderRepositoriesPage(page) {

        // Clear previous repositories
        repoList.innerHTML = '';

      
        const startIndex = (page - 1) * perPage;
        const endIndex = Math.min(startIndex + perPage, totalRepos);

        
        fetchRepositories(username, page, perPage)
            .then(repositoriesPage => {
                repositoriesPage.forEach(data => {
                    
                    const repositoryCard = document.createElement('div');
                    repositoryCard.classList.add('card');
                    repositoryCard.classList.add('reveal-from-right')

                    const miniGrid = document.createElement('div');
                    miniGrid.classList.add('mini-grid');
                    const starAndForkContainer = document.createElement('div');
                    
                    const starAndForkHtml = `
                    <div class="mini-grid grid-center mg-up-7">
                        <div class="mini-grid grid-center mg-rt">
                                <img class="icon icon-sm" src="./images/star.png">
                            <p class = "sml-number">${data.stargazers_count}</p>
                        </div>
                        <div class="mini-grid grid-center">
                            <img class="icon icon-sm" src="./images/fork.png">
                            <p class = "sml-number">${data.forks}</p>
                        </div>
                    </div>
                    `;
                    starAndForkContainer.innerHTML = starAndForkHtml;
                    const repositoryName = document.createElement('a');
                    repositoryName.classList.add('card-title');
                    repositoryName.href = data.html_url;
                    repositoryName.textContent = data.name;
                    miniGrid.appendChild(repositoryName);
                    

                    const descriptionCont = document.createElement('div');
                    descriptionCont.classList.add('desc-cont');
                    const description = document.createElement('div');
                    description.classList.add('description')
                    description.innerText = data.description;
                    descriptionCont.appendChild(description);

                    repositoryCard.appendChild(miniGrid);
                    repositoryCard.appendChild(descriptionCont);
                    

                    // Display topics, if available
                    if (data.topics && data.topics.length > 0) {
                        const overflowhidder = document.createElement('div');
                        overflowhidder.classList.add('ov-hid');
                        const topicsContainer = document.createElement('div');
                        topicsContainer.classList.add('topics-list')
        

                        data.topics.forEach(topic => {
                            const topicTag = document.createElement('div');
                            topicTag.classList.add('topic')
                            const cleanedTopic = topic.replace(/-/g, '');
                            topicTag.textContent = cleanedTopic;
                            topicsContainer.appendChild(topicTag);
                        });
                        overflowhidder.appendChild(topicsContainer);

                        repositoryCard.appendChild(overflowhidder);
                        
                    }
                    repositoryCard.appendChild(starAndForkContainer);

                    repoList.appendChild(repositoryCard);
                });
            });
    }

    renderRepositoriesPage(currentPage);
    
    renderPagination(totalPages, renderRepositoriesPage);
}

async function listAllReposInJSON(username) {
    const perPage = 100; 
    let page = 1;
    let allRepositories = [];

    try {
        while (true) {
            const apiUrl = `https://api.github.com/users/${username}/repos?page=${page}&per_page=${perPage}`;
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error('Unable to fetch repositories data');
            }

            const repositoriesData = await response.json();

            if (repositoriesData.length === 0) {
                // No more repositories, break the loop
                break;
            }

            allRepositories = allRepositories.concat(repositoriesData);
            page++;
        }

        // console.log('All Repositories for', username, ':', allRepositories);
        return allRepositories;
    } catch (error) {
        console.error('Error fetching repositories data:', error.message);
    }
}





const searchInput = document.getElementById('searchInput');
const data =  listAllReposInJSON(username);

searchInput.addEventListener('click',()=>{
    searchRepos(username);
})
var firstNullFlg = true;
searchInput.addEventListener('input', function () {
    const searchQuery = this.value.trim().toLowerCase();

   
    if (searchInput.value.trim() === '') {
        if(firstNullFlg){
            Repositories(username,10); 
            firstNullFlg = false;
        }
    }
    if(!firstNullFlg){
        searchRepos(username);
        firstNullFlg = true;
    }
   
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        const title = card.querySelector('.card-title').textContent.toLowerCase();
        const display = title.includes(searchQuery) ? 'block' : 'none';
        card.style.display = display;
    });
    

});

async function searchRepos(user){
   const repos =await listAllReposInJSON(user);
   const cardList = document.querySelector('.cards-list');
   cardList.innerHTML = '';
   console.log(repos);

   repos.forEach((data)=>{
    const repositoryCard = document.createElement('div');
                    repositoryCard.classList.add('card');
                    repositoryCard.classList.add('reveal-from-right')

                    const miniGrid = document.createElement('div');
                    miniGrid.classList.add('mini-grid');
                    const starAndForkContainer = document.createElement('div');
                    
                    const starAndForkHtml = `
                    <div class="mini-grid grid-center mg-up-7">
                        <div class="mini-grid grid-center mg-rt">
                                <img class="icon icon-sm" src="./images/star.png">
                            <p class = "sml-number">${data.stargazers_count}</p>
                        </div>
                        <div class="mini-grid grid-center">
                            <img class="icon icon-sm" src="./images/fork.png">
                            <p class = "sml-number">${data.forks}</p>
                        </div>
                    </div>
                    `;
                    starAndForkContainer.innerHTML = starAndForkHtml;
                    const repositoryName = document.createElement('a');
                    repositoryName.classList.add('card-title');
                    repositoryName.href = data.html_url;
                    repositoryName.textContent = data.name;
                    miniGrid.appendChild(repositoryName);
                    

                    const descriptionCont = document.createElement('div');
                    descriptionCont.classList.add('desc-cont');
                    const description = document.createElement('div');
                    description.classList.add('description')
                    description.innerText = data.description;
                    descriptionCont.appendChild(description);

                    repositoryCard.appendChild(miniGrid);
                    repositoryCard.appendChild(descriptionCont);
                    

                    // Display topics, if available
                    if (data.topics && data.topics.length > 0) {
                        const overflowhidder = document.createElement('div');
                        overflowhidder.classList.add('ov-hid');
                        const topicsContainer = document.createElement('div');
                        topicsContainer.classList.add('topics-list')
        

                        data.topics.forEach(topic => {
                            const topicTag = document.createElement('div');
                            topicTag.classList.add('topic')
                            const cleanedTopic = topic.replace(/-/g, '');
                            topicTag.textContent = cleanedTopic;
                            topicsContainer.appendChild(topicTag);
                        });
                        overflowhidder.appendChild(topicsContainer);

                        repositoryCard.appendChild(overflowhidder);
                        
                    }
                    repositoryCard.appendChild(starAndForkContainer);
                cardList.appendChild(repositoryCard);
   })
   

}


// Function to render search results
function renderSearchResults(searchResults) {
    const searchResultsContainer = document.getElementById('repos-list');

    // Clear previous search results
    searchResultsContainer.innerHTML = '';

    // Render search results
    searchResults.forEach(data => {
        const repositoryCard = document.createElement('div');
                    repositoryCard.classList.add('card');

                    const miniGrid = document.createElement('div');
                    miniGrid.classList.add('mini-grid');
                    const starAndForkContainer = document.createElement('div');
                    const starAndForkHtml = `
                    <div class="mini-grid grid-center mg-up-7">
                        <div class="mini-grid grid-center mg-rt">
                            <img class="icon icon-sm" src="./images/star.png">
                            <p class = "sml-number">${data.stargazers_count}</p>
                        </div>
                        <div class="mini-grid grid-center">
                            <img class="icon icon-sm" src="./images/fork.png">
                            <p class = "sml-number">${data.forks}</p>
                        </div>
                    </div>
                    `;
                    starAndForkContainer.innerHTML = starAndForkHtml;
                    const repositoryName = document.createElement('a');
                    repositoryName.classList.add('card-title');
                    repositoryName.href = data.html_url;
                    repositoryName.textContent = data.name;
                    miniGrid.appendChild(repositoryName);
                    

                    const descriptionCont = document.createElement('div');
                    descriptionCont.classList.add('desc-cont');
                    const description = document.createElement('div');
                    description.classList.add('description')
                    description.innerText = data.description;
                    descriptionCont.appendChild(description);

                    repositoryCard.appendChild(miniGrid);
                    repositoryCard.appendChild(descriptionCont);
                    

                    // Display topics, if available
                    if (data.topics && data.topics.length > 0) {
                        const overflowhidder = document.createElement('div');
                        overflowhidder.classList.add('ov-hid');
                        const topicsContainer = document.createElement('div');
                        topicsContainer.classList.add('topics-list')
        

                        data.topics.forEach(topic => {
                            const topicTag = document.createElement('div');
                            topicTag.classList.add('topic')
                            const cleanedTopic = topic.replace(/-/g, '');
                            topicTag.textContent = cleanedTopic;
                            topicsContainer.appendChild(topicTag);
                        });
                        overflowhidder.appendChild(topicsContainer);

                        repositoryCard.appendChild(overflowhidder);
                        
                    }
                    repositoryCard.appendChild(starAndForkContainer);

                   
        searchResultsContainer.appendChild(repositoryCard);
    });
}

// ...


// Fetch and render repositories with default value (e.g., 10 repositories per page)
Repositories(username, 10);





async function fetchUserProfile(username) {
    const apiUrl = `https://api.github.com/users/${username}`;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error('Unable to fetch user data');
        }

        const userData = await response.json();



        // Log some user information
        console.log('Username:', userData.login);
        console.log('Full Name:', userData.name);
        console.log('Bio:', userData.bio);
        console.log('Email:', userData.email);
        console.log('Avatar URL:', userData.avatar_url);
        console.log('GitHub Profile URL:', userData.html_url);
        console.log('Public Repositories:', userData.public_repos);
        totalRepos = userData.public_repos;
        console.log('Followers:', userData.followers);
        console.log('Following:', userData.following);
        console.log('Account Created:', userData.created_at);
        console.log('Account Last Updated:', userData.updated_at);
        return userData;
    } catch (error) {
        console.error('Error fetching user data:', error.message);
    }
}


async function UserProfile(user) {
    const userData = await fetchUserProfile(user);
    setUserProfileImage(userData.avatar_url);

    setUserInformation(userData.login, userData.name, userData.bio,
        userData.email, userData.html_url, userData.public_repos,
        userData.followers, userData.following);
}
UserProfile('johnpapa');


function setUserProfileImage(url) {
    const profileImg = document.querySelector(".profile-photo-img");
    profileImg.src = url;
}

function setUserInformation(userName, fullName, bio, email, gitUrl, repoCount, followers, following) {
    const userNameElement = document.querySelector(".username");
    const fullNameElement = document.querySelector(".fullname");
    const bioElement = document.querySelector(".bio");
    const emailElement = document.querySelector(".email");
    const gitUrlElement = document.querySelector(".giturl");
    const repoCountElement = document.querySelector(".repo-count");
    const followersElement = document.querySelector(".followers");
    const followingElement = document.querySelector(".following");

    const emailContainer = document.querySelector(".email-cont");
    const giturlContainer = document.querySelector(".giturl-cont");
    const repoContainer = document.querySelector(".repo-cont");
    const followersContainer = document.querySelector(".followers-cont");
    const followingContainer = document.querySelector(".following-cont");

    if (!email) emailContainer.style.display = 'none';
    if (!gitUrl) giturlContainer.style.display = 'none';
    if (!repoCount) repoContainer.style.display = 'none';
    if (!followers) followersContainer.style.display = 'none';
    if (!following) followingContainer.style.display = 'none';

    userNameElement.textContent = userName || null;
    fullNameElement.textContent = fullName || null;
    bioElement.textContent = bio || null;
    emailElement.textContent = email || null;
    gitUrlElement.textContent = gitUrl || null;
    repoCountElement.textContent = repoCount || null;
    followersElement.textContent = followers || null;
    followingElement.textContent = following || null;
}


const selectElement = document.getElementById('reposPerPage');

// Event listener for the select box
selectElement.addEventListener('change', function () {
    // Fetch repositories with the selected number per page
    const selectedPerPage = this.value;
    Repositories('johnpapa', selectedPerPage);
});
Repositories('johnpapa', 10);








