const playersURL = 'http://localhost:3000/players'
const tokensURL = 'http://localhost:3000/tokens'
const gamesURL = 'http://localhost:3000/games'
const logoURL = "../slot-daddy-frontend/assets/SlotDaddyLogo.png"
const body = document.querySelector('body')
//const errors = document.getElementById('errors')
let allPlayers = []
let currentGame;
let currentPlayer;
let gameScore = 0

let slotNums = []

let values = [1,2,3,4,5,6,7,8,9]
let x = getRandomInt(9)
let time = 20

let x2 = getRandomInt(9)
let time2 = 20

let x3 = getRandomInt(9)
let time3 = 20

getAllPlayers()
onPageLoad()


// DATA
function getAllPlayers(){
    fetch(playersURL)
    .then(r => r.json())
    // .then(console.log)
    .then(data => allPlayers = data)
}


function createPlayer(player){
    fetch(playersURL,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(player)
    })
    .then(r => r.json())
    .then(data => {
        if (data['error']){
            let errorP = document.createElement('div')
            errorP.id = 'errors'
            let form = document.querySelector('form')
            if(!!document.getElementById('errors')){
                return
            }else{
                errorP.textContent = data['error']
                body.appendChild(errorP)
                form.reset()
            }
        }else{
            allPlayers.push(data)
            playerHomePage(data)
        }
    })
    .catch(error => console.log(error.message))
}

function findPlayer(player){
    if(allPlayers.find(p => p.username == player.username)){
        p = allPlayers.find(p => p.username == player.username)
        playerHomePage(p)
    }else{
        let errorP = document.createElement('div')
        errorP.id = 'errors'
        let form = document.querySelector('form')
        if(!!document.getElementById('errors')){
            return
        }else{
            errorP.textContent = 'Invalid Username.'
            body.appendChild(errorP)
            form.reset()
        }
    }
    
}

function addToken(player){
    fetch(tokensURL,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({player_id: player.id})
    })
    .then(r => r.json())
    // .then(console.log)
    .then(bigtoken => updateTokenBalance(bigtoken))
    .catch(error => console.log(error.message))
}

function createGame(player){
    fetch(gamesURL,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({player_id: player.id})
    })
    .then(r => r.json())
    .then(game => {
      currentGame = game
      currentPlayer = player
      })
    .catch(error => console.log(error.message))
}

function endGame(game){
    fetch(gamesURL+`/${game.id}`,{
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({score: gameScore})
    })
    .then(r => r.json())
    .then(getHighScores)
    .catch(error => console.log(error.message))
}

function getHighScores(){
    fetch(gamesURL)
    .then(r => r.json())
    .then(arr => gameOver(arr))
}

function depleteToken(token){
    fetch(tokensURL+`/${token.id}`,{
        method: 'DELETE'
    })
    .then(r => r.json())
    .then(() => {
        let t = document.getElementById('game-token-count')
        t.textContent = currentPlayer.tokens.length
        console.log(currentPlayer.tokens.length)
    })
}




//DOM

function bigFlashyLogo(){
  document.body.style.backgroundImage = 'url(../slot-daddy-frontend/assets/DaddySlots.jpg)'
  document.body.style.backgroundSize = '1450px 800px'
  let logoDiv = document.createElement('div')
  let logoBorder = document.createElement('div')
  let logo = document.createElement('img')

  logoBorder.id = "flashing-logo-border"
  logo.id = "logo-img"
  logo.src = logoURL
  logoDiv.id = 'logo-div'

  logoBorder.appendChild(logo)
  logoDiv.appendChild(logoBorder)
  body.appendChild(logoDiv)
}


function onPageLoad(){
    let buttonDiv = document.createElement('div')
    let loginButton = document.createElement('button')
    let registerButton = document.createElement('button')
    //leftButtonCol
    //rightButtonCol
    buttonCol = document.createElement('div')
    // let rightButtonCol = document.createElement('div')

    buttonDiv.id = "login-register-div"
    buttonDiv.className = "row h-100 justify-content-center align-items-center"
    buttonCol.className = 'col-sm-12 text-center gap-3'
    // rightButtonCol.className = 'col-sm'
    loginButton.textContent = "Login"
    loginButton.style = "margin-right:90px;"
    loginButton.className = 'btn btn-outline-light pull-right'
    loginButton.id = 'login-button'
    registerButton.textContent = "Register"
    registerButton.className = 'btn btn-outline-light'
    registerButton.id = 'register-button'

    loginButton.addEventListener('click',loginScreen)
    registerButton.addEventListener('click',registerScreen)

    //LOGO HERE
    bigFlashyLogo()
    buttonCol.append(loginButton,registerButton)
    // rightButtonCol.appendChild(registerButton)
    buttonDiv.append(buttonCol)
    body.appendChild(buttonDiv)
}

function playerHomePage(player){
    body.innerHTML = ''
    //console.log(player.tokens.length)
    
    //score logic
    let maxScore = 0
    let scores = []
    if(player.games.length != 0){
        player.games.forEach(game => {
            scores.push(parseInt(game.score))
        })
    }
    if (scores.length != 0){
        maxScore = Math.max(...scores)
    }
    // create elements
    let container = document.createElement('div')
    let welcomeDiv = document.createElement('div')
    let greeting = document.createElement('h2')
    let tokenDiv = document.createElement('div')
    let tokenCount = document.createElement('h4')
    let tokenSpan = document.createElement('h4')
    let highScoreDiv = document.createElement('div')
    let highScore = document.createElement('h4')
    let highScoreSpan = document.createElement('h4')
    let buttonDiv = document.createElement('div')
    let newGameButton = document.createElement('button')
    let buyTokenButton = document.createElement('button')

    let highScoreAndBalance = document.createElement('div')
    let hsabCol1 = document.createElement('div')
    let hsabCol2 = document.createElement('div')
    highScoreAndBalance.className = "row text-center"
    hsabCol1.className = "col"
    hsabCol2.className = "col"
    hsabCol1.style = 'margin-left:500px;'
    hsabCol2.style = 'margin-right:500px;'
    
    // element attributes
    welcomeDiv.id = 'welcome-div'
    greeting.textContent = `Welcome < ${player.username} >`
    greeting.className = 'neon'
    tokenCount.textContent = 'Token Balance: '
    tokenSpan.textContent = player.tokens.length
    tokenSpan.id = 'token-span'
    highScore.textContent = 'High Score: '
    highScoreSpan.textContent = maxScore
    highScoreSpan.id = 'high-score-span'
    newGameButton.textContent = 'START NEW GAME'
    buyTokenButton.textContent = 'BUY TOKEN'

    container.className = 'text-center'
    welcomeDiv.className = 'text-center'
    welcomeDiv.style = ' position: fixed;top: 0;left: 0;z-index: 999;width: 100%;height: 100px; padding-top:30px;'
    container.style = 'padding-top:250px;'
    buttonDiv.style = 'padding-top:30px;'

    newGameButton.className = "btn btn-success"
    buyTokenButton.className = "btn btn-warning"
    newGameButton.style = 'margin-right:90px; height:160px; width:130px;'
    buyTokenButton.style = 'height:160px; width:130px;'

    highScore.style = 'color:white; text-align: left;'
    tokenCount.style = 'color:white; text-align: left;'
    //highScore.className = 'row'
    //tokenCount.classname = 'row'

    //highScoreSpan.style = 'color:white; text-align: right;'
    tokenSpan.className = 'neon'
    tokenSpan.style = 'color:white; text-align: right; font-size:2em;'
    highScoreSpan.className = 'neon'
    highScoreSpan.style = 'color:white; text-align: right; font-size:2em;'

    buyTokenButton.addEventListener('click',() => addToken(player))
    newGameButton.addEventListener('click',() => newGame(player))
    
    // append elements
    welcomeDiv.append(greeting)
    //tokenCount.appendChild(tokenSpan)
    //tokenDiv.appendChild(tokenCount)
    //highScore.appendChild(highScoreSpan)
    //highScoreDiv.appendChild(highScore)
    hsabCol1.append(highScore,tokenCount)
    hsabCol2.append(highScoreSpan,tokenSpan)
    highScoreAndBalance.append(hsabCol1,hsabCol2)
    buttonDiv.append(newGameButton,buyTokenButton)
    
    container.append(highScoreAndBalance,buttonDiv)
    
    bigFlashyLogo()
    body.append(welcomeDiv,container)


}

//loginscreen
function loginScreen(){
    body.innerHTML = ''
    let formDiv = document.createElement('div')
    let form = document.createElement('form')
    let input = document.createElement('input')
    let loginButton = document.createElement('button')
    let backButton = document.createElement('button')

    loginButton.className = 'btn btn-outline-light'
    backButton.className = 'btn btn-outline-light'
    

    backButton.textContent = 'back'
    input.placeholder = 'username:'
    loginButton.textContent = 'Login'
    input.name = 'username'
    formDiv.className = 'row text-center'
    formDiv.style = 'padding-top:285px;'
    form.className = "form-inline"
    input.className = "sr-only"
    input.style = 'margin-right:90px; margin-left:90px;  background-color: lightgoldenrodyellow;'
    

    backButton.addEventListener('click',onPageLoad)
    loginButton.addEventListener('click', handleLogin)

    form.append(backButton,input,loginButton)
    formDiv.appendChild(form)
    //LOGO HERE
    bigFlashyLogo()
    body.appendChild(formDiv)

}
//register screen
function registerScreen(){
    body.innerHTML = ''
    let formDiv = document.createElement('div')
    let form = document.createElement('form')
    let input = document.createElement('input')
    let registerButton = document.createElement('button')
    let backButton = document.createElement('button')

    registerButton.className = 'btn btn-outline-light'
    backButton.className = 'btn btn-outline-light'

    backButton.textContent = 'back'
    input.placeholder = 'username:'
    registerButton.textContent = 'Register'
    input.name = 'username'
    formDiv.className = 'row text-center'
    formDiv.style = 'padding-top:285px;'
    form.className = "form-inline"
    input.className = "sr-only"
    input.style = 'margin-right:90px; margin-left:90px;  background-color: lightgoldenrodyellow;'

    backButton.addEventListener('click',onPageLoad)
    registerButton.addEventListener('click', handleNewPlayer)
    
    form.append(backButton,input,registerButton)
    formDiv.appendChild(form)
    //LOGO HERE
    bigFlashyLogo()
    body.appendChild(formDiv)
}

function gameOver(arr){
    body.innerHTML = ''

    //sort array
    arr = arr.sort((a, b) => (a.score > b.score) ? -1 : 1)
    arr = arr.slice(0,10)
    //create elements
    let gameOverDiv = document.createElement('div')
    let scoreDiv = document.createElement('div')
    let usernameDiv = document.createElement('div')
    let leaderBoardDiv = document.createElement('div')
    let playAgainDiv = document.createElement('div')
    let score = document.createElement('h1')
    let userName = document.createElement('h4')
    let winnersBanner = document.createElement('h1')
    let winnersOl = document.createElement('ol')
    let youSuck = document.createElement('h2')
    let playAgainBtn = document.createElement('button')

    //modify elements
    score.textContent = 'GAME OVER'
    userName.textContent = currentPlayer.username
    winnersBanner.textContent = 'WINNERS'
    youSuck.textContent = 'YOU SUCK!'
    youSuck.id = 'you-suck'
    playAgainBtn.textContent = 'PLAY AGAIN?'
    playAgainBtn.id = 'play-again-button'

    playAgainBtn.addEventListener('click', () => playerHomePage(currentPlayer))

    //playerSpan logic
    function highScorePlayer(game){
      return allPlayers.find(player => player.id == game.player_id)
    }
    
    //populate scoreboard
    arr.forEach(game => {
      let li = document.createElement('li')
      let scoreSpan = document.createElement('span')
      let playerSpan = document.createElement('span')
      scoreSpan.id = 'score-span'
      playerSpan.id = 'player-span'
      scoreSpan.textContent = game.score
      playerSpan.textContent = highScorePlayer(game).username
      li.append(scoreSpan, playerSpan)
      winnersOl.appendChild(li)
    })

    //append elements
    scoreDiv.appendChild(score)
    usernameDiv.appendChild(userName)
    leaderBoardDiv.append(winnersBanner, winnersOl)
    playAgainDiv.append(youSuck, playAgainBtn)
    gameOverDiv.append(scoreDiv, usernameDiv, leaderBoardDiv, playAgainDiv)
    body.appendChild(gameOverDiv)
}

function updateTokenBalance(bigtoken){
    let tokenSpan = document.getElementById('token-span')
    tokenSpan.innerHTML = ''
    tokenSpan.textContent = bigtoken['token_count']
  
    allPlayers.forEach(player => {
      if (player.id == bigtoken['token']['player_id']){
        player.tokens.push(bigtoken["token"])
      }
    })
}

// GAME

function newGame(player){
    createGame(player)
    body.innerHTML = ''
    document.body.style.backgroundImage = 'url(../slot-daddy-frontend/assets/casino.jpg)'
    
    // create elements
    let gameWindow = document.createElement('div')
    let playerScoreDiv = document.createElement('div')
    let scoreRow = document.createElement('div')
    let scoreDiv = document.createElement('div')
    let playerTokens = document.createElement('div')
    let rollBtnDiv = document.createElement('div')
    let endBtnDiv = document.createElement('div')
    let rulesDiv = document.createElement('div')

    let username = document.createElement('h5')
    let score = document.createElement('h1')
    let tokes = document.createElement('div')

    let slotMachine = document.createElement('div')

    let slotMachine1 = document.createElement('div')
    let slotMachine2 = document.createElement('div')
    let slotMachine3 = document.createElement('div')

    let slotValue1 = document.createElement('h1')
    let slotValue2 = document.createElement('h1')
    let slotValue3 = document.createElement('h1')

    let rollBtn = document.createElement('button')
    let endBtn = document.createElement('button')

    let rules1 = document.createElement('p')
    let rules2 = document.createElement('p')
    // let rules3 = document.createElement('p')
    let rules4 = document.createElement('p')
    let rules5 = document.createElement('p')

    // attributes
    gameWindow.id = "game-window"
    gameWindow.className = "container"
    slotMachine.className = "slot-machine-container"
    slotMachine.id = "slot-machine-parent"
    slotMachine1.className = 'slot'
    slotMachine1.id = 'slot1'
    slotValue1.className = 'value'
    slotValue1.id = 'value1'

    slotMachine2.className = 'slot'
    slotMachine2.id = 'slot2'
    slotValue2.className = 'value'
    slotValue2.id = 'value2'

    slotMachine3.className = 'slot'
    slotMachine3.id = 'slot3'
    slotValue3.className = 'value'
    slotValue3.id = 'value3'

    playerScoreDiv.className = 'row text-center'
    playerScoreDiv.id = 'player-score-div'
    slotMachine.className = 'row'
    rollBtnDiv.className = 'row button-div text-center'
    rulesDiv.className = 'row text-center rules'
    endBtnDiv.className = 'row text-center'
    endBtnDiv.id = 'end-button'

    slotValue1.textContent = 7
    slotValue2.textContent = 7
    slotValue3.textContent = 7

    username.textContent = `< ${player.username} >`
    tokes.textContent = player.tokens.length
    tokes.id = "tokes"
    playerTokens.id = 'game-token-count'
    playerTokens.className = 'slot align-middle'
    playerScoreDiv.style = "color:white;"

    scoreRow.id = "score-token-parent"
    scoreRow.className = "slot-machine-container"
    scoreDiv.id = "score-div"
    scoreDiv.className = "slot"
    score.id = 'score'
    score.textContent = 0

    rollBtn.id = "roll-btn"
    rollBtn.textContent = 'ROLL'
    rollBtn.className = "btn btn-danger game-button"
    rollBtn.style = 'width:130px;'
    endBtn.textContent = 'END GAME'
    endBtn.className = "btn btn-outline-danger game-button"
    endBtn.style = 'width:130px;'

    rulesDiv.style = "color:white;"
    rules1.textContent = "ANY two of a kind = 250"
    rules2.textContent = "THREE of a kind = n x 100"
    rules4.textContent = "THREE 7's = 5000"
    rules5.textContent = "THREE 1's = YOUR SCORE IS 0, LOL NERD"

    rollBtn.addEventListener('click', masterRoll)
    endBtn.addEventListener('click',() => endGame(currentGame))
    
    // append children
    scoreDiv.appendChild(score)
    playerTokens.appendChild(tokes)

    slotMachine1.appendChild(slotValue1)
    slotMachine2.appendChild(slotValue2)
    slotMachine3.appendChild(slotValue3)

    rulesDiv.append(rules1,rules2,rules4,rules5)
    
    rollBtnDiv.appendChild(rollBtn)
    endBtnDiv.appendChild(endBtn)

    // append parent elements
    scoreRow.append(scoreDiv, playerTokens)
    playerScoreDiv.append(username,scoreRow)
    slotMachine.append(slotMachine1,slotMachine2,slotMachine3)
    gameWindow.append(playerScoreDiv,slotMachine,rollBtnDiv,rulesDiv,endBtnDiv)
    body.appendChild(gameWindow)
}


function masterRoll(){
    // call a function that takes event listener away from roll btn, and starts a 7 sec timer to add it back
    if(currentPlayer.tokens.length == 0){
        // console.log('NO COIN')
        endGame(currentGame)
    }else{
        if(currentPlayer.tokens.length == 2){
            let errors = document.createElement('div')
            errors.id = 'errors'
            errors.textContent = "LAST CHANCE SUCKA! YOU'RE BROKE"
            body.appendChild(errors)
        }
        let t = currentPlayer.tokens.shift()
        // console.log(t)
        depleteToken(t)
        rollDiv1()
        rollDiv2()
        rollDiv3()
        rollBtnTimer()
        setTimeout(function(){
            // console.log(slotNums)
            updateScore(slotNums);
        },6900);
    }
}

function rollBtnTimer(){
    let rollBtn = document.getElementById('roll-btn')
    rollBtn.removeEventListener('click',masterRoll)
    setTimeout(function(){
        rollBtn.addEventListener('click',masterRoll)
    },7100)
}




function rollDiv1(){
    let value = document.getElementById('value1')
    if(time > 250){
        resetRoll()
        slotNums[0] = parseInt(value.textContent)
        return
    }
    value.textContent = values[x]
    time += 10
    setTimeout(rollDiv1, time)
    if(x+1 == 9){
        x = 0
    }else{
        x += 1
    }
}

function rollDiv2(){
    let value = document.getElementById('value2')
    if(time2 > 300){
        resetRoll2()
        slotNums[1] = parseInt(value.textContent)
        return
    }
    value.textContent = values[x2]
    time2 += 10
    setTimeout(rollDiv2, time2)
    if(x2+1 == 9){
        x2 = 0
    }else{
        x2 += 1
    }
}

function rollDiv3(){
    let value = document.getElementById('value3')
    if(time3 > 350){
        resetRoll3()
        slotNums[2] = parseInt(value.textContent)
        return
    }
    value.textContent = values[x3]
    time3 += 10
    setTimeout(rollDiv3, time3)
    if(x3+1 == 9){
        x3 = 0
    }else{
        x3 += 1
    }
}


//MATH SHIT

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function updateScore(arr){
    score = document.getElementById('score')
    currentScore = parseInt(score.textContent)
    newScore = 0
    counts = {}

    for(i = 0; i < arr.length; i++){
        if(counts[arr[i]]){
            counts[arr[i]] += 1
        }else{
            counts[arr[i]] = 1
        }
    }
    let countObj = Object.values(counts);
    let max = Math.max(...countObj);
    if(max === 1){
        return
    }
    if(max === 2){
        newScore = 250
    }
    if(max === 3){
        if(arr[0] === 1){
            newScore = currentScore * -1
        }
        if(arr[0] === 2){
            newScore = 200
        }
        if(arr[0] === 3){
            newScore = 300
        }
        if(arr[0] === 4){
            newScore = 400
        }
        if(arr[0] === 5){
            newScore = 500
        }
        if(arr[0] === 6){
            newScore = 600
        }
        if(arr[0] === 7){
            newScore = 5000
        }
        if(arr[0] === 8){
            newScore = 800
        }
        if(arr[0] === 9){
            newScore = 900
        }
    }
    score.textContent = currentScore + newScore
    gameScore = currentScore + newScore
}

//end game page
function resetRoll(){
    x = getRandomInt(9)
    time = 20
}

function resetRoll2(){
    x2 = getRandomInt(9)
    time2 = 20
}

function resetRoll3(){
    x3 = getRandomInt(9)
    time3 = 20
}


// HANDLERS

function handleNewPlayer(e){
    e.preventDefault()
    player = {
        username: e.target.parentElement.username.value
    }
    createPlayer(player)
}

function handleLogin(e){
    e.preventDefault()
    player = {
        username: e.target.parentElement.username.value
    }
    findPlayer(player)
}



// SLOT LOGIC


