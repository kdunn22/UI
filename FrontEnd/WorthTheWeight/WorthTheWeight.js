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
    

    //create url string
    var urlPost = 'http://ec2-3-93-71-21.compute-1.amazonaws.com:3000/api/log?x=' + namePost +'&y=' + calPost + '&z=' + date + '&q=' + mealPost

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

//function to get/calculate/display calorie budget on the log page
function getCalBudget(){
    fetch('http://ec2-3-93-71-21.compute-1.amazonaws.com:3000/api/log/budget')
        .then(
            function(response) {
            if (response.status !== 200) {
                console.log('Looks like there was a an error retrieving the data.');
                console.log(response);
                return;
                }
            response.json().then(function(data){
                    var heightCent = (data.response[0].height_feet * 30.48) + (data.response[0].height_inches * 2.54);
                    var weight = data.response[0].weight * .453592;
                    var age = data.response[0].age;
                    //bmr is calculated here using the Mifflin-St Jeor Equation: https://www.calculator.net/bmr-calculator.html
                    var bmr = (10 * weight) + (6.25 * heightCent) - (5 * age) + 5;
                    document.getElementById('calBudget').innerHTML = bmr - 500;
                })
            }
        )
        .catch(function(err) {
            console.log('Fetch Error', err);
        });
}

function getGoalWeight() {
    //get data to populate weight/goal on page load
    fetch('http://ec2-3-93-71-21.compute-1.amazonaws.com:3000/api/weight')
        .then(
            function(response) {
            if (response.status !== 200) {
                console.log('Looks like there was a an error retrieving the data.');
                console.log(response);
                return;
                }
            response.json().then(function(data){
                    document.getElementById('goalTable').rows[1].cells[0].innerHTML = data.response[0].weight_goal;
                    document.getElementById('weightTable').rows[1].cells[0].innerHTML = data.response[0].weight;
                })
            }
        )
        .catch(function(err) {
            console.log('Fetch Error', err);
        });
    
    //get data to populate trends on page load
    fetch('http://ec2-3-93-71-21.compute-1.amazonaws.com:3000/api/weight/trends')
        .then(
            function(response) {
            if (response.status !== 200) {
                console.log('Looks like there was a an error retrieving the data.');
                console.log(response);
                return;
                }
            response.json().then(function(data){
                    document.getElementById('trendTable').rows[1].cells[0].innerHTML = data.response[0].weight;
                    var dateOne = data.response[0].track_date;
                    document.getElementById('trendTable').rows[1].cells[1].innerHTML = dateOne.substring(0,10);
                    document.getElementById('trendTable').rows[1].cells[2].innerHTML = data.response[0].weight - data.response[1].weight;

                    document.getElementById('trendTable').rows[2].cells[0].innerHTML = data.response[1].weight;
                    var dateTwo = data.response[1].track_date;
                    document.getElementById('trendTable').rows[2].cells[1].innerHTML = dateTwo.substring(0,10);
                    document.getElementById('trendTable').rows[2].cells[2].innerHTML = data.response[1].weight - data.response[2].weight;

                    document.getElementById('trendTable').rows[3].cells[0].innerHTML = data.response[2].weight;
                    var dateThree = data.response[2].track_date;
                    document.getElementById('trendTable').rows[3].cells[1].innerHTML = dateThree.substring(0,10);
                    document.getElementById('trendTable').rows[3].cells[2].innerHTML = data.response[2].weight - data.response[3].weight;
                })
            }
        )
        .catch(function(err) {
            console.log('Fetch Error', err);
        });
    }
function addGoalWeight(state){
    let type = state;
    if (type !=='current'){
        document.getElementById('goalTable').rows[1].cells[0].innerHTML = document.getElementById(type).value;
        goal = document.getElementById(type).value;
        fetch("http://ec2-3-93-71-21.compute-1.amazonaws.com:3000/api/weight/goal?x=" + goal, {
        
            
            mode: "no-cors",
            method: "POST",
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
            .then(response => response.json())
            .then(putData => {
                console.log('Success:', putData);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    } else {
        //date stuff
        var d = new Date();
        var year = d.getFullYear();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        var hours = d.getHours();
        var minutes = d.getMinutes();
        var seconds = d.getSeconds();
        var date = + year + '-0' + month + '-0' + day + " " + hours + ":" + minutes + ":" + seconds;
        
        document.getElementById('weightTable').rows[1].cells[0].innerHTML = document.getElementById(type).value;
        weight = document.getElementById(type).value;
        var fetchURL = "http://ec2-3-93-71-21.compute-1.amazonaws.com:3000/api/weight/weight?x=" + weight + "&y=" + date;
        fetch(fetchURL, {
            mode: "no-cors",
            method: "POST",
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
            .then(response => response.json())
            .then(putData => {
                console.log('Success:', putData);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
    getGoalWeight();
}

// This function is used to validate login
// ************NOTE****************
// THIS IS NOT A SECURE LOGIN
// For MVP, passwords are not encrypted in the database. 
// The user enters email and password, query pulls password from database based on entered email (done on server)
// Client side fetch calls this endpoint to get password from db for entered email
// Client side JS compares password from db to password enters and lets user enter if they match
function validateLogin(){
    email = document.getElementById('email').value;
    password = document.getElementById('password').value;
    if (email == "" || password == "") {
        alert("Please enter your email address and password.")
    } else {
        //get password from db for entered email
        fetch('http://ec2-3-93-71-21.compute-1.amazonaws.com:3000/api/login?x=' + email)
        .then(
            function(response) {
            if (response.status !== 200) {
                console.log('Looks like there was a an error retrieving the data.');
                console.log(response);
                return;
                }
            response.json().then(function(data){
                try {
                    if (data.response[0].pass_word == password) {
                        sessionStorage.setItem("userid", 1);
                        goToDash();
                    } else  {
                        alert("Incorrect Password! Please try again.");
                        document.getElementById('password').value = "";
                    }
                    }
                    catch(err){
                        console.log(err);
                        document.getElementById('email').value = "";
                        document.getElementById('password').value = "";
                        alert("No account found for the email entered! Please try again.");
                    }   
                })
            }
        )
        .catch(function(err) {
            console.log('Fetch Error', err);
        });
    }
}

function createAccount() {
    fname = document.getElementById('fname').value;
    lname = document.getElementById('lname').value;
    email = document.getElementById('emailCreate').value;
    password = document.getElementById('passwordCreate').value;

    if (fname == "" || lname == "" || email == "" || password == ""){
        alert("Please fill out all fields!")
    } else {
        var fetchURL = "http://ec2-3-93-71-21.compute-1.amazonaws.com:3000/api/createaccount?x=" + fname + "&y=" + lname + "&z=" + email + "&q=" + password;
        console.log(fetchURL);
        fetch(fetchURL, {

            mode: "no-cors",
            method: "POST",
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
            .then(response => response.json())
            .then(putData => {
                console.log('Success:', putData);
                
            })
            .catch((error) => {
                console.error('Error:', error);
            });
            goToDash();
        }
        
}

function goToDash() {
    window.location.href = "http://s3.amazonaws.com/worththeweight.com/Dashboard.html";
}


