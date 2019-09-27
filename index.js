// api variables
const tmdbApiKey = 'api_key=9b9e4d62897f63e207cd44de1a946ebf';
const tmdbUrl = 'https://api.themoviedb.org/3/search/movie?';
const tmdbMovieByGenre =
	'https://api.themoviedb.org/3/movie/now_playing?&language=en-US&region=US';
const tmdbGenreUrl = 'https://api.themoviedb.org/3/genre/movie/list?';
const posterBasePath = 'http://image.tmdb.org/t/p/w300';
const minRatingUrl = '&vote_average.gte=';
const genreUrl = '&with_genres=';

// get page elements
let resultsList = document.getElementById('movielist');
let genreDDList = document.getElementById('genre');
let ratingDDList = document.getElementById('rating');
let findbyGenre = document.querySelector('#genreFind');
let attribElement = document.querySelector('.footer');

// async function getMovieData() {
// 	console.log('about to fetch movies');
// 	const response = await fetch(
// 		tmdbUrl + tmdbApiKey + '&query=it+chapter+two'
// 	);
// 	const data = await response.json();
// 	return data.results;
// }

// get the movie data
function fetchMovies(url) {
	// function to get the movie data
	async function getMovieByGenre(apiUrl) {
		const response = await fetch(apiUrl);
		const data = await response.json();
		return data;
	}

	// after getting the movie data, build the page
	getMovieByGenre(url)
		.then((data) => {
			// get current page of the data
			let pageNum = parseInt(data.page);

			// div where the movie data will be put
			let movieDiv = document.querySelector('.movies');

			// remove everything from the destination div
			lastListItem = movieDiv.lastElementChild;
			while (lastListItem) {
				movieDiv.removeChild(lastListItem);
				lastListItem = movieDiv.lastElementChild;
			}

			// pull the array of movies from the return data
			let movies = data.results;
			// build the page one movie at a time
			movies.forEach((movie) => {
				// duplicate the card that's already on the page
				let movieCard = document.querySelector('.card.mb-3');
				let newCard = movieCard.cloneNode(true);
				let options = {
					weekday : 'long',
					year    : 'numeric',
					month   : 'short',
					day     : 'numeric'
				};

				// location of the movie poster
				let posterPath = posterBasePath + movie.poster_path;

				// place the movie data into the cloned card
				newCard.querySelector('h5').innerText = movie.title;
				newCard.querySelector('p').innerText = movie.overview;
				newCard.querySelector('small').innerText =
					'Released: ' +
					new Date(movie.release_date).toLocaleDateString(
						'en-us',
						options
					);
				newCard.querySelector('small').innerText +=
					'  - user rating: ' +
					parseFloat(movie.vote_average) * 10 +
					'%';

				// if the movie poster is blank use a placeholder
				if (!movie.poster_path) {
					console.log(movie);
					posterPath =
						'https://uploads.neatorama.com/images/posts/95/58/58095/1360112719-0.jpg';
				}

				// set the movie poster
				newCard
					.querySelector('img')
					.setAttribute('src', posterPath);
				document
					.querySelector('.movies')
					.appendChild(newCard);
			});

			// handle the case where there are multiple pages of data
			let nextPageBtn = document.getElementById('nextButton');
			if (pageNum < parseInt(data.total_pages)) {
				// add the next page number to the url
				let newUrl = url + '&page=' + ++pageNum;
				// function to get the next page of data
				function nextPage() {
					console.log(newUrl);
					fetchMovies(newUrl);
					window.scrollTo(0, 0);
				}

				// if this is not the first page, there may already
				// be a next page button if not, make one
				if (!nextPageBtn) {
					// making new button
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
					// using old button
					nextPageBtn.removeEventListener(
						'click',
						nextPage
					);
					nextPageBtn.addEventListener('click', nextPage);
				}
			} else {
				// if last page, remove button
				if (nextPageBtn) {
					document
						.querySelector('.container')
						.removeChild(nextPageBtn);
				}
			}
		})
		.catch((err) => console.log(err, err.message));
}

// gets the genre list from the api
async function getGenres() {
	const response = await fetch(tmdbGenreUrl + tmdbApiKey);
	const data = await response.json();
	const genreList = data.genres;
	return genreList;
}

// calls getGenres and then populates the genre drop-down
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

// click listener for the find button
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

// call to poplulate the genre drop-down
populateGenre();
