function fetchData(url,options){
    return fetch(url,options).then((response)=>response.json()).catch((err)=>err);
}
function getRepoByUsers(event){
    event.preventDefault();
    var getRepoUrl = 'https://api.github.com/users/DeepanP/repos';
    fetchData(getRepoUrl).then((result)=>{
        console.log(result);
    },(error)=>{
        console.log(error);
    }).catch(function(error){
        console.log(error);
    });
}