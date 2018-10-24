
var AUTH0_CLIENT_ID='pI2hZe0tAKEDUcq7KP7pO98pzVF54V6D';
var AUTH0_DOMAIN='assignment1.auth0.com';
var AUTH0_CALLBACK_URL=location.href+'?loginCallback';
var Access_token = 'b9c56d2d822fcc2f9a9f97e00f6b6f3756d05e88';
window.addEventListener('load', function() {
    var content = document.querySelector('.content');
    var loadingSpinner = document.getElementById('loading');
    content.style.display = 'block';
    loadingSpinner.style.display = 'none';
  
    var lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN, {
      autoclose: true,
      auth: {
        redirectUrl: AUTH0_CALLBACK_URL,
        responseType: 'token id_token',
        params: {
          scope: 'openid'
        }
      }
    });
  
    lock.on('authenticated', function(authResult) {
      if (authResult && authResult.accessToken && authResult.idToken) {
        setSession(authResult);
      }
      displayButtons();
    });
  
    lock.on('authorization_error', function(err) {
      console.log(err);
      alert('Error: ' + err.error + '. Check the console for further details.');
      displayButtons();
    });
  
    // buttons and event listeners
    var loginBtn = document.getElementById('btn-login');
    var logoutBtn = document.getElementById('btn-logout');
  
    loginBtn.addEventListener('click', login);
    logoutBtn.addEventListener('click', logout);
  
    function login() {
      lock.show();
    }
  
    function setSession(authResult) {
      // Set the time that the access token will expire at
      var expiresAt = JSON.stringify(
        authResult.expiresIn * 1000 + new Date().getTime()
      );
      localStorage.setItem('access_token', authResult.accessToken);
      localStorage.setItem('id_token', authResult.idToken);
      localStorage.setItem('expires_at', expiresAt);
    }
  
    function logout() {
      // Remove tokens and expiry time from localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('id_token');
      localStorage.removeItem('expires_at');
      displayButtons();
    }
  
    function isAuthenticated() {
      // Check whether the current time is past the
      // access token's expiry time
      var expiresAt = JSON.parse(localStorage.getItem('expires_at'));
      return new Date().getTime() < expiresAt;
    }
  
    function displayButtons() {
      var loginStatus = document.querySelector('.container h4');
      if (isAuthenticated()) {
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'inline-block';
        loginStatus.innerHTML = 'You are logged in!';
      } else {
        loginBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'none';
        loginStatus.innerHTML =
          'You are not logged in! Please log in to continue.';
      }
    }
  
    displayButtons();
  });

var userName = '';
var repoList = [];
var getRepoUrl = { url: 'https://api.github.com/users/:owner/repos', tokens:['owner']};
var createIssueUrl = { url: 'https://api.github.com/repos/:owner/:repo/issues', tokens:['owner','repo']};
var postissuesUrl = '';
var submitButton = document.getElementById('gitUserNameSubmit');
var lastRepoClicked;
function generateUrl(urlObject,values){
    let newUrlObject = urlObject.url;
    urlObject.tokens.map((item)=>{
        newUrlObject = newUrlObject.replace((':'+item),values[item]);
    })
    return newUrlObject;
}

function fetchData(url,options){
    return fetch(url,options).then((response)=>response.json()).catch((err)=>err);
}

function updateUserName(e){
    userName = e.value;
    document.getElementById('issueContainer').setAttribute('hidden');
}

function getRepoByUsers(event){
    event.preventDefault();
    userName = document.getElementById('gitUserName').value;
    if(!userName.length){
        alert('Please Enter Username');
        return false;
    }
    var newGetRepoUrl = generateUrl(getRepoUrl,{owner:userName});
    submitButton.disabled = true;
    fetchData(newGetRepoUrl).then((result)=>{
        renderRepoList(result);
        submitButton.disabled = false;
    },(error)=>{
        console.log(error);
        alert('Verify console for error');
    }).catch(function(error){
        console.log(error);
        alert('Verify console for error');
    });
}

function createRepoItem(repo){
    var li = document.createElement('li');
    var liattr = document.createAttribute('class');
    liattr.value = 'list-group-item';
    li.setAttribute('class','list-group-item');
    var spanItem = document.createElement('span');
    spanItem.innerHTML = repo.name;
    var attr = document.createAttribute('class');
    attr.value = repo.name;
    var buttonItem = document.createElement('button');
    buttonItem.innerText='+ issue';
    buttonItem.addEventListener('click',(event)=>{
        var innerRepo = repo;
        var scopEvent = event;
        createIssueByUrl(innerRepo.owner.login, innerRepo.name, scopEvent);
    });
    li.appendChild(spanItem);
    li.appendChild(buttonItem);
    document.getElementById('repoList').appendChild(li);
}

function renderRepoList(result) {
    result.map((repo)=>{
        createRepoItem(repo);
    });
    document.getElementById('issueContainer').removeAttribute('hidden');
}

function createIssueByUrl(owner,reponame, event){
    if(!lastRepoClicked && !event.target.classList.length){
        lastRepoClicked = event;
    }else{
        lastRepoClicked.target.classList.remove('active');
        lastRepoClicked = event;
    }
    event.target.classList.add('active');
    postissuesUrl = generateUrl(createIssueUrl,{'owner':owner,repo:reponame});
    document.getElementById('issueTextContainer').removeAttribute('hidden');
    var spantext = document.getElementById('repo-name');
    spantext.innerHTML=reponame;
}

function submitIssue(event){
    event.preventDefault();
    var data = {
        "title": document.getElementById('issueTitle').value,
        "body": document.getElementById('issueDesc').value
    };
    var fetchOption = {
        method: "POST", 
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    };
    postissuesUrl = postissuesUrl+'?&access_token='+Access_token;
    fetchData(postissuesUrl,fetchOption).then((result)=>{
        console.log(result);
        if(result.message){
            alert(result.message);
        }
        else{
            alert('Issue created successfully');
        }
    },(error)=>{
        console.log(error);
        alert('Verify console for error');
    }).catch(function(error){
        console.log(error);
        alert('Verify console for error');
    });
}