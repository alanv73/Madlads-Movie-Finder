const tmdbApiKey = 'api_key=9b9e4d62897f63e207cd44de1a946ebf';
const tmdbUrl = 'https://api.themoviedb.org/3/search/movie?';
const tmdbMovieByGenre =
	'https://api.themoviedb.org/3/movie/now_playing?&language=en-US&region=US';
const tmdbGenreUrl = 'https://api.themoviedb.org/3/genre/movie/list?';
const posterBasePath = 'http://image.tmdb.org/t/p/w300';
const minRatingUrl = '&vote_average.gte=';
const genreUrl = '&with_genres=';

let resultsList = document.getElementById('movielist');
let genreDDList = document.getElementById('genre');
let ratingDDList = document.getElementById('rating');
let findbyGenre = document.querySelector('#genreFind');
let attribElement = document.querySelector('.footer');

async function getMovieData() {
	console.log('about to fetch movies');
	const response = await fetch(
		tmdbUrl + tmdbApiKey + '&query=it+chapter+two'
	);
	const data = await response.json();
	return data.results;
}

function fetchMovies(url) {
	async function getMovieByGenre(apiUrl) {
		const response = await fetch(apiUrl);
		const data = await response.json();
		return data;
	}

	getMovieByGenre(url)
		.then((data) => {
			let pageNum = parseInt(data.page);
			let movieDiv = document.querySelector('.movies');

			lastListItem = movieDiv.lastElementChild;
			while (lastListItem) {
				movieDiv.removeChild(lastListItem);
				lastListItem = movieDiv.lastElementChild;
			}

			let movies = data.results;
			movies.forEach((movie) => {
				//card
				let movieCard = document.querySelector('.card.mb-3');
				let newCard = movieCard.cloneNode(true);
				let posterPath = posterBasePath + movie.poster_path;

				newCard.querySelector('h5').innerText = movie.title;
				newCard.querySelector('p').innerText = movie.overview;
				newCard.querySelector('small').innerText =
					parseFloat(movie.vote_average) * 10 +
					'% user rating';

				if (!movie.poster_path) {
					console.log(movie);
					posterPath =
						'https://uploads.neatorama.com/images/posts/95/58/58095/1360112719-0.jpg';
				}

				newCard
					.querySelector('img')
					.setAttribute('src', posterPath);
				document
					.querySelector('.movies')
					.appendChild(newCard);
			});

			let nextPageBtn = document.getElementById('nextButton');
			if (pageNum < parseInt(data.total_pages)) {
				let newUrl = url + '&page=' + ++pageNum;
				function nextPage() {
					console.log(newUrl);
					fetchMovies(newUrl);
					window.scrollTo(0, 0);
				}

				if (!nextPageBtn) {
					console.log('making new button');
					nextPageBtn = document.createElement('button');
					nextPageBtn.innerText = 'Next Page';
					nextPageBtn.classList.add('btn');
					nextPageBtn.classList.add('btn-primary');
					nextPageBtn.setAttribute('id', 'nextButton');
					document
						.querySelector('.container')
						.insertBefore(nextPageBtn, attribElement);

					nextPageBtn.addEventListener('click', nextPage);
				} else {
					console.log('using old button');
					nextPageBtn.removeEventListener(
						'click',
						nextPage
					);
					nextPageBtn.addEventListener('click', nextPage);
				}
			} else {
				if (nextPageBtn) {
					document
						.querySelector('.container')
						.removeChild(nextPageBtn);
				}
			}
		})
		.catch((err) => console.log(err, err.message));
}

async function getGenres() {
	const response = await fetch(tmdbGenreUrl + tmdbApiKey);
	const data = await response.json();
	const genreList = data.genres;
	return genreList;
}

function populateGenre() {
	getGenres()
		.then((genres) => {
			genres.forEach((genre) => {
				let newGenreOption = document.createElement('option');
				newGenreOption.setAttribute('value', genre.id);
				let genreText = document.createTextNode(genre.name);

				newGenreOption.appendChild(genreText);
				genreDDList.appendChild(newGenreOption);
			});
		})
		.catch((err) => console.log(err, err.message));
}

findbyGenre.addEventListener('click', () => {
	let selectedGenre = genreDDList.value;
	let selectedRating = ratingDDList.value;

	let url =
		tmdbMovieByGenre +
		'&' +
		tmdbApiKey +
		minRatingUrl +
		selectedRating;

	if (selectedGenre > 0) {
		url += genreUrl + selectedGenre;
	}

	console.log(url);

	fetchMovies(url);
});

populateGenre();
