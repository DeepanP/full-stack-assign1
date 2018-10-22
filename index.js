
/*window.addEventListener('load', function() {

    var webAuth = new auth0.WebAuth({
      domain: 'assignment1.auth0.com',
      clientID: 'd666790ca8e2a07b59cd',
      responseType: 'token id_token',
      scope: 'openid',
      redirectUri: window.location.href
    });
  
    //var loginBtn = document.getElementById('btn-login');
  
    //loginBtn.addEventListener('click', function(e) {
      //e.preventDefault();
      webAuth.authorize();
    //});
  
  });*/
var userName = '';
var repoList = [];
var getRepoUrl = { url: 'https://api.github.com/users/:owner/repos', tokens:['owner']};
var createIssueUrl = { url: 'https://api.github.com/repos/:owner/:repo/issues', tokens:['owner','repo']};
var postissuesUrl = '';
var submitButton = document.getElementById('gitUserNameSubmit');

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
    }).catch(function(error){
        console.log(error);
    });
}

function createRepoItem(repo){
    var li = document.createElement('li');
    var spanItem = document.createElement('span');
    spanItem.innerHTML = repo.name;
    var attr = document.createAttribute('class');
    attr.value = repo.name;
    var buttonItem = document.createElement('button');
    buttonItem.innerText='+ issue';
    buttonItem.addEventListener('click',()=>{
        var innerRepo = repo;
        createIssueByUrl(innerRepo.owner.login, innerRepo.name);
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

function createIssueByUrl(owner,reponame){
    postissuesUrl = generateUrl(createIssueUrl,{'owner':owner,repo:reponame});
    document.getElementById('issueTextContainer').removeAttribute('hidden');
}

function submitIssue(){
    
    var data = {
        "title": "Found a bug",
        "body": "I'm having a problem with this.",
        "assignees": [
          userName
        ],
        "milestone": 1,
        "labels": [
          "bug"
        ]
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
    fetchData(postissuesUrl,fetchOption).then((result)=>{
        console.log(result);
    },(error)=>{
        console.log(error);
    }).catch(function(error){
        console.log(error);
    });
}