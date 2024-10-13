class PageLoader {
    constructor(main) {
        this.main = main;
    }

    loadContent(page) {
        fetch(page)
            .then(response => response.text())
            .then(data => {
                document.getElementById(this.main).innerHTML = data;
            })
            .catch(error => {
                document.getElementById(this.main).innerHTML = "<p>Sisältöä ei voitu ladata.</p>";
                console.error('Virhe sisällön latauksessa:', error);
            });
    }
}

class Uskallatko {
    constructor(loader, messageElementId, mainElementId) {
        this.loader = loader; // PageLoader-olio
        this.messageElementId = messageElementId;
        this.mainElementId = mainElementId;
    }

    askConfirmation() {
        let vastaus;
        if (confirm("Oletko varma?")) {
            vastaus = "uskalsit";
            setTimeout(() => {
                this.loadImage()
                alert("PöÖöÖöÖ");
            }, 2000);
        } else {
            vastaus = "Et uskaltanut";
        }

        // Vastaus näkyy -> ja piilotetaan se 5 sekunnin kuluttua
        setTimeout(() => {
            document.getElementById(this.messageElementId).innerHTML = vastaus;
        }, 500);

        setTimeout(() => {
            document.getElementById(this.messageElementId).innerHTML = "";
        }, 5000);
    }
    loadImage() {
        const mainElement = document.getElementById(this.mainElementId);
        const img = document.createElement('img');
        img.src = 'assets/pictures/pictures/ghost.jpg';
        img.alt = 'Kummitus';
        img.style.width = '100%';
        img.style.maxWidth = '200px';
        img.style.display = 'block';
        img.style.margin = '0 auto';

        mainElement.innerHTML = '';
        mainElement.appendChild(img);
    }
}

const pageLoader = new PageLoader('main');
const uskallatko = new Uskallatko(pageLoader, 'vastaus', 'main');

async function fetchCarParks() {
    try{
    const response = await fetch('https://api.oulunliikenne.fi/proxy/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: '{ carParks { name, maxCapacity, spacesAvailable } }'
        })
    });
    if (!response.ok) {
        throw new Error('Virhe haettaessa tietoja' + response.status);
    }

    const data = await response.json();
    return data.data.carParks;
}   catch (error) {
    console.error('Virhe haettaessa tietoja:', error.message);
    throw error;
}
}

function populateTable(carParks) {
    const tableBody = document.querySelector('#carParksTable tbody');
    tableBody.innerHTML = ''; // Tyhjennä taulukon body

    carParks.forEach(carPark => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${carPark.name}</td>
            <td>${carPark.maxCapacity}</td>
            <td>${carPark.spacesAvailable}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Lataa parkkipaikkataulukko
function loadCarParksTable() {
    fetchCarParks().then(carParks => {
        const filteredCarParks = carParks.filter(carPark =>
            carPark.name === 'Valkea' || carPark.name === 'Autosaari' || carPark.name === 'Pekuri'
            || carPark.name === 'Scandic' || carPark.name === 'Kivisydän' || carPark.name === 'Technopolis'
            || carPark.name === 'Autoheikki');

            if(filteredCarParks.length === 0) {
                throw new Error('Parkkihallin tietoja ei löytynyt');
            }
        
        // Luodaan taulukko
        const tableHTML = `
            <table id="carParksTable">
                <thead>
                    <h6> Parkkihallit </h6>
                    <tr>
                        <th>Nimi</th>
                        <th>Maksimikapasiteetti</th>
                        <th>Vapaata tilaa</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        `;
        
        // Asetetaan taulukko main-elementtiin
        document.getElementById('main').innerHTML = tableHTML;

        // Täytetään taulukko tiedoilla
        populateTable(filteredCarParks);
    }) .catch(error => {
        document.getElementById('main').innerHTML = '<p style="color: red;">Virhe ladatessa parkkihallien tietoja </p>'; 
    });
}
async function fetchJokes() {
    try{
        const response = await fetch('https://v2.jokeapi.dev/joke/Programming');
        if (!response.ok) {
            throw new Error('Virhe haettaessa vitsejä' + response.status);
    }
    const data = await response.json();
    return data.jokes ? data.jokes : [data];
} catch (error) {
    console.error('Virhe haettaessa vitsejä:', error.message);
    throw error;
}
}

function populateJokes(jokes) {
    const mainElement = document.querySelector('#main');
    mainElement.innerHTML = ''; // Tyhjennä main-elementti

    jokes.forEach(joke => {
        let jokeHTML;
        if(joke.type === 'single') {
            jokeHTML = `<p>${joke.joke}</p>`;
        } else {
            jokeHTML = `<p>${joke.setup}</p><p>${joke.delivery}</p>`;
        }
        mainElement.innerHTML += jokeHTML;
    });
}

function loadJokes() {
    fetchJokes().then(jokes => {
        populateJokes(jokes);
    }).catch(error => {
        document.getElementById('main').innerHTML = '<p style="color: red;">Virhe ladatessa vitsejä</p>';
    });
}
