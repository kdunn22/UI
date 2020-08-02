function getMeal(mealType){
var search = document.getElementById(mealType).value;
var logTable = document.getElementById('logTable')
var url = 'https://api.nutritionix.com/v1_1/search/' + search + '?results=0:1&fields=item_name,nf_calories&appId=8f6f160e&appKey=b1faaff0da2551cf674f119bf131b33d'


switch(mealType){
    case 'bMeal':
        var x = 1;
        break;
    case 'lMeal':
        var x = 2;
        break;
    case 'dMeal':
        var x = 3;
        break;
    case 'sMeal':
        var x = 4;
        break;
}

fetch(url)
    .then(
        function(response) {
            if (response.status !== 200) {
              console.log('Looks like there was a an error retrieving the data.');
              return;
            }
        response.json().then(function(data){
                var name = data.hits[0].fields["item_name"];
                var cal = data.hits[0].fields["nf_calories"];
                logTable.rows[x].cells[1].innerHTML = name;
                logTable.rows[x].cells[2].innerHTML = cal;
                logMeal(name, cal, mealType);
            })
        }
        
    )
    .catch(function(err) {
        console.log('Fetch Error', err);
    });


//fetch('http://localhost:3000/users')
    //.then(
        //function(response) {
           // if (response.status !== 200) {
             // console.log('Looks like there was a an error retrieving the data.');
              //return;
           // }
       // response.json().then(function(data){
               // console.log(data);
           // })
       // }
    //)
    //.catch(function(err) {
        //console.log('Fetch Error', err);
    //});

}

function logMeal(foodName, foodCal, mealType) {
    var namePost = foodName 
    var calPost = foodCal
    var mealPost = mealType

    //date stuff
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var date = + year + '-0' + month + '-0' + day;

    var urlPost = 'http://localhost:3000/users?x=' + namePost +'&y=' + calPost + '&z=' + date + '&q=' + mealPost

    console.log(urlPost);
    fetch(urlPost, {
        
        mode: "no-cors",
        method: "POST",
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    })
        
        .then(response => response.json())
        .then(postData => {
            console.log('Success:', postData);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}