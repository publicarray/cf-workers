const indexHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>Random Raffle Draw</title>
    <style>
    :root { /* light ☀️ */
        color-scheme: light dark;
        --font-color: #000;
        --bg-color: #f1f1f1;
    }
    /* https://caniuse.com/#feat=prefers-color-scheme */
    @media (prefers-color-scheme: dark) {
        :root { /* dark 🌘 */
            --font-color: #e6eaea;
            --bg-color: #222326;
        }
    }
    body {
        font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif;
        background: var(--bg-color);
        color: var(--font-color);
        transition: color ease 0.5s, background ease 0.5s;
    }
    </style>
</head>
<body>
<h1>Random Raffle Draw</h1>
<!-- <p>This is all generated using a Worker</p> -->
<div id="stepOne">
    <h2>Step One</h2>
    <p>Add your raffle booklets</p>
    <form action="" name="add">
        <label for="max">Number of raffle tickets in book</label>
        <input type="number" name="max" value="100" min="1" required>
        <label for="colour">Colour of raffle book</label>
        <input type="text" name="colour" placeholder="red">
        <label for="letter">Letter of raffle book</label>
        <input type="text" name="letter" placeholder="A" maxlength="1">
        <input type="submit" value="Add raffle booklet">
    </form>
    <ul class="raffleBooksList"></ul>
    <form  action="" name="start">
        <input type="submit" name="start" value="Start Raffle" disabled>
    </form>
</div>

<div id="stepTwo" hidden>
    <h2>Step Two</h2>
    <p>Draw Winners</p>
    <form  action="" name="draw">
        <input type="submit" name="drawWinner" value="Draw a Winner">
    </form>
    <ul class="raffleWinnersList"></ul>
    <form  action="" name="restart">
        <input type="submit" name="restart" value="Restart">
    </form>
</div>


<script>
    // Todo
    // css / styles
    // offline storage
    // delete raffle books
    let addForm = document.querySelector('form[name=add]')
    let raffleBooksList = document.querySelector('.raffleBooksList')
    let raffleWinnersList = document.querySelector('.raffleWinnersList')
    let startForm = document.querySelector('form[name=start]')
    let drawForm = document.querySelector('form[name=draw]')
    let restartForm = document.querySelector('form[name=restart]')
    let stepOne = document.getElementById('stepOne')
    let stepTwo = document.getElementById('stepTwo')
    let maxWinners = 0
    // Data
    let raffleBooks = []
    let raffleWinners = []

    addForm.onsubmit = function submitAdd(event) {
        event.preventDefault()
        let max = parseInt(event.target.querySelector('input[name=max]').value)
        let colour = event.target.querySelector('input[name=colour]').value
        let letter = event.target.querySelector('input[name=letter]').value.toUpperCase()
        let raffleBook = {
            max: max,
            colour: colour,
            letter: letter,
        }
        // check for duplicates
        for (var i = 0; i < raffleBooks.length; i++) {
            if (raffleBooks[i].max === max && raffleBooks[i].colour === colour && raffleBooks[i].letter === letter) {
                console.warn('duplicate not added!', raffleBook)
                alert('Duplicate raffle booklet not added!')
                return
            }
        }
        raffleBooks.push(raffleBook)
        // raffleBooksList.appendChild(raffleBookToHtml(raffleBook))
        raffleBooksList.insertBefore(raffleBookToHtml(raffleBook), raffleBooksList.childNodes[0])
        event.target.reset()

        // GET parameters
        // let parameters = new URL(window.location.href).searchParams
        // let max = parameters.get('max')
        // let colour = parameters.get('colour')
        // let letter = parameters.get('letter')
        if (raffleBooks.length === 1) {
            startForm.querySelector('input[name=start]').removeAttribute('disabled')
        }

    }

    function raffleBookToHtml (item) {
        let liEl = document.createElement('li')
        liEl.innerText = item.max + ' - ' + item.colour + ' - ' + item.letter
        return liEl
    }
    startForm.onsubmit = function submitStart(event) {
        event.preventDefault()
        stepOne.setAttribute('hidden', '')
        stepTwo.removeAttribute('hidden')
        // calculate max possible winners
        for (var i = 0; i < raffleBooks.length; i++) {
            maxWinners += raffleBooks[i].max
        }
        event.target.reset()
    }
    drawForm.onsubmit = function submitDraw(event) {
        event.preventDefault()
        // stop an infinite loop when the user attempts to award more winners than raffle tickets available
        if (raffleWinners.length >= maxWinners) {
            console.warn('Maximum possible winners awarded', maxWinners)
            return
        }

        let winnerFound = false
        let dublicateFound = false
        let winner = {num: 0, colour: '', letter: ''}
        while (!winnerFound) {
            let pickBook = randomNumber(raffleBooks.length)
            // +1 since raffles start with 1 and not 0
            let pickNumber = randomNumber(raffleBooks[pickBook].max) + 1
            winner = {
                num: pickNumber,
                colour: raffleBooks[pickBook].colour,
                letter: raffleBooks[pickBook].letter,
            }
            // check for duplicate
            for (var i = 0; i < raffleWinners.length; i++) {
                if (raffleWinners[i].num === winner.num && raffleWinners[i].colour === winner.colour && raffleWinners[i].letter === winner.letter) {
                    console.warn('Already won, re-draw!', i, winner)
                    dublicateFound = true
                    break
                }
            }
            winnerFound = !dublicateFound
            dublicateFound = false
        }
        raffleWinners.push(winner)
        // raffleWinnersList.appendChild(raffleWinnerToHtml(winner))
        raffleWinnersList.insertBefore(raffleWinnerToHtml(winner), raffleWinnersList.childNodes[0])
        event.target.reset()
    }
    function raffleWinnerToHtml (item) {
        let liEl = document.createElement('li')
        liEl.innerText = item.colour + ' - ' + item.letter + ' - ' + item.num
        return liEl
    }

    function randomNumber(max) {
        // Divide a random UInt32 by the maximum value (2^32 -1) to get a result between 0 and 1
        return Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / 4294967295 * max)
    }

    // backForm.onsubmit = function submitRestart(event) {
    //     event.preventDefault()
    //     stepTwo.setAttribute('hidden', '')
    //     stepOne.removeAttribute('hidden')
    //     event.target.reset()
    // }
    restartForm.onsubmit = function submitRestart(event) {
        event.preventDefault()
        raffleWinners = []
        maxWinners = 0
        raffleBooks = []
        raffleBooksList.innerHTML = ''
        raffleWinnersList.innerHTML = ''
        startForm.querySelector('input[name=start]').setAttribute('disabled', '')
        stepTwo.setAttribute('hidden', '')
        stepOne.removeAttribute('hidden')
        event.target.reset()
    }

//     function store() {
//         localStorage.setItem("names", JSON.stringify(names));
//     }
// var names = [];
// names[0] = prompt("New member name?");
// localStorage.setItem("names", JSON.stringify(names));

// //...
// var storedNames = JSON.parse(localStorage.getItem("names"));

//save changes when navigating
    // var isDirty = function() { return false }
    // window.onload = function() {
    //     window.addEventListener("beforeunload", function (e) {
    //         if (formSubmitting || !isDirty()) {
    //             return undefined
    //         }
    //         var confirmationMessage = 'It looks like you have been editing something. '
    //                                 + 'If you leave before saving, your changes will be lost.';
    //         (e || window.event).returnValue = confirmationMessage; //Gecko + IE
    //         return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
    //     })
    // }
</script>

<!-- <script type="module">
  import { openDB, deleteDB, wrap, unwrap } from 'https://unpkg.com/idb?module';

  async function doDatabaseStuff() {
    const db = await openDB(…);
  }
</script> -->
</body>
</html>
`

async function handleRequest(request) {
    return new Response(indexHTML, {
        headers: {
            'content-type': 'text/html;charset=UTF-8',
        },
    })
}
module.exports = handleRequest
