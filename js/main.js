// main.js – Vue 3 app til Eurovision deltagere

const app = Vue.createApp({
    data() {
        return {
            // Siderubrik
            intro: 'Eurovision 2025 - Deltageroversigt',

            // Liste af alle deltagere (hentes fra API)
            participants: [],

            // Formularfelter til ny deltager
            newCountry: '',    // Land
            newArtist: '',     // Artist
            newSong: '',       // Sang
            newGroup: '',      // Gruppe

            // Søgefelt for filtrering på land
            searchCountry: '',

            // Hvad vi aktuelt sorterer på (fx 'country' for land)
            currentSort: '',

            // URL til API (tjek evt. portnummer)
            apiUrl: 'https://localhost:7065/api/participants',
        }
    },
    methods: {
        // Hent deltagere fra API (med evt. filter/sortering)
        fetchParticipants() {
            let url = this.apiUrl + '?';
            // Tilføj sortering hvis valgt
            if (this.currentSort) url += `sort_by=${this.currentSort}&`;
            // Tilføj filtrering hvis brugeren har skrevet noget
            if (this.searchCountry) url += `country=${encodeURIComponent(this.searchCountry)}`;
            // Hent data fra API
            axios.get(url)
                .then(response => {
                    this.participants = response.data;
                })
                .catch(error => {
                    alert('Fejl ved hentning af deltagere: ' + error);
                });
        },

        // Tilføj deltager via API
        addParticipant() {
            // Tjek at alle felter er udfyldt
            if (!this.newCountry.trim() || !this.newArtist.trim() || !this.newSong.trim() || !this.newGroup.trim()) {
                alert("Alle felter skal udfyldes!");
                return;
            }
            // Lav POST-request til API
            axios.post(this.apiUrl, {
                country: this.newCountry,
                artist: this.newArtist,
                song: this.newSong,
                group: this.newGroup
            })
            .then(() => {
                // Hent listen igen (så ny deltager vises)
                this.fetchParticipants();
                // Nulstil felter
                this.newCountry = '';
                this.newArtist = '';
                this.newSong = '';
                this.newGroup = '';
            })
            .catch(error => {
                alert('Fejl ved oprettelse af deltager: ' + (error.response?.data || error));
            });
        },

        // Slet deltager via API
        deleteParticipant(id) {
            axios.delete(`${this.apiUrl}/${id}`)
                .then(() => {
                    this.fetchParticipants();
                })
                .catch(error => {
                    alert('Fejl ved sletning: ' + error);
                });
        },

        // Sortér listen alfabetisk efter Land
        sortByCountry() {
            this.currentSort = 'country';
            this.fetchParticipants();
        },

        // Filtrér listen på Land (kaldes ved input)
        filterList() {
            this.fetchParticipants();
        }
    },

    // Når appen starter, hentes listen første gang
    mounted() {
        this.fetchParticipants();
    }
});