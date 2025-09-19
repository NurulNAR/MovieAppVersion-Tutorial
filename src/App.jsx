import { use, useEffect, useState } from 'react'
import Search from './components/Search.jsx'
import Spinner from './components/Spinner.jsx';
import MovieCard from './components/MovieCard.jsx';

const API_BASE_URL = 'https://api.themoviedb.org/3';

//import dari local sbb kalau letak sini key users boleh nampak kat inspect
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

//authorization ni kalau salah error
const API_OPTIONS = {
  method: 'GET',
  headers: { 
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  const fetchMovies = async (query = '') => {
  setIsLoading(true);
  setErrorMessage('');
  
  try {
    const endpoint = query
    //enocodeURIComponent supaya kalau special chars tak error
    ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
    : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

    const response = await fetch(endpoint, API_OPTIONS);

    if(!response.ok) {
      throw new Error('Failed to fetch movies');
    }

    const data = await response.json();

    if(data.Response == 'False') {
      setErrorMessage(data.Error || 'Failed to fetch movies')
      setMovieList([]);
      return;
    }

    setMovieList(data.results || [] );
  } catch (error) {
    console.log(`Error fetching movies: ${error}`);
    setErrorMessage('Error fetching movies. Try again later.');
  } finally {
    setIsLoading(false);
  }

}

  useEffect(() => {
    fetchMovies(searchTerm);
    //console.log('search term changed', searchTerm);
  }, [searchTerm]);

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./hero-img.png" alt="hero image" />
          <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy</h1>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
        
        <h1 className="text-white">{searchTerm}</h1>

        <section className="all-movies">
          <h2 className="text-white mt-[40px]">All Movies</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>

        
      </div>
  </main>
  )
}

export default App