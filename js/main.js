// main.js – Vue 3 app til Eurovision deltagere

const app = Vue.createApp({
    data() {
        return {
            // Siderubrik
            intro: 'Oscars 2025 - Filmoversigt',

            // Liste af alle deltagere (hentes fra API)
            film: [],

            // Formularfelter til ny deltager
            newTitle: '',    // Title
            newDirector: '',     // Director
            newYear: '',       // Year
            newCountry: '',      // Land
            newAwards: '',       // Awards

            // Søgefelt for filtrering på land
            searchCountry: '',

            // Hvad vi aktuelt sorterer på (fx 'country' for land)
            currentSort: '',

            // URL til API (tjek evt. portnummer)
            apiUrl: 'https://localhost:7176/api/films',
        }
    },
    methods: {
        // Hent film fra API (med evt. filter/sortering)
        fetchFilms() {
            let url = this.apiUrl + '?';
            // Tilføj sortering hvis valgt
            if (this.currentSort) url += `sort_by=${this.currentSort}&`;
            // Tilføj filtrering hvis brugeren har skrevet noget
            if (this.searchCountry) url += `country=${encodeURIComponent(this.searchCountry)}`;
            // Hent data fra API
            axios.get(url)
                .then(response => {
                    this.film = response.data;
                })
                .catch(error => {
                    alert('Fejl ved hentning af film: ' + error);
                });
        },

        // Tilføj film via API
        addFilm() {
            // Tjek at alle felter er udfyldt
            if (!this.newTitle.trim() || !this.newDirector.trim() || !this.newYear.trim() || !this.newCountry.trim() || !this.newAwards.trim()) {
                alert("Alle felter skal udfyldes!");
                return;
            }
            // Lav POST-request til API
            axios.post(this.apiUrl, {
                title: this.newTitle,
                director: this.newDirector,
                year: this.newYear,
                country: this.newCountry,
                awards: this.newAwards
            })
            .then(() => {
                // Hent listen igen (så ny deltager vises)
                this.fetchFilms();
                // Nulstil felter
                this.newTitle = '';
                this.newDirector = '';
                this.newYear = '';
                this.newCountry = '';
                this.newAwards = '';
            })
            .catch(error => {
                alert('Fejl ved oprettelse af film: ' + (error.response?.data || error));
            });
        },

        // Slet film via API
        deleteFilm(id) {
            axios.delete(`${this.apiUrl}/${id}`)
                .then(() => {
                    this.fetchFilms();
                })
                .catch(error => {
                    alert('Fejl ved sletning: ' + error);
                });
        },

        // Sortér listen alfabetisk efter Land
        sortByCountry() {
            this.currentSort = 'country';
            this.fetchFilms();
        },

        // Filtrér listen på Land (kaldes ved input)
        filterList() {
            this.fetchFilms();
        }
    },

    // Når appen starter, hentes listen første gang
    mounted() {
        this.fetchFilms();
    }
});