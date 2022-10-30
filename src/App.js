import { useState, useEffect } from 'react';
import './App.css';
import SearchIcon from './assets/search.svg';
import MovieCard from './components/MovieCard';

const API_URL = 'http://www.omdbapi.com/?apikey=3b6a61c0';

function App() {

  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const getInitialMovies = async (year) => {
    const initRes = await fetch(`${API_URL}&s=2022&y=${year}&type=movie&page=1`);
    const data_init = await initRes.json();

    setMovies(data_init.Search);
    setTotalPages(Math.round(parseInt(data_init.totalResults, 10) / 10));
  }

  const searchMovies = async (title) => {
    const response = await fetch(`${API_URL}&s=${title}&page=1`);
    const data = await response.json();

    setTotalPages(Math.round(parseInt(data.totalResults, 10) / 10));
    setMovies(data.Search);
  }

  const goToPage = async (pageNo) => {
    const pageRes = await fetch(`${API_URL}&s=${search ? search : '2022'}&type=movie&page=${pageNo}`);
    const pageData = await pageRes.json();

    setMovies(pageData.Search);
  }

  useEffect(() => {
    getInitialMovies('2022');
  }, []);

  return (
    <div className="app">
      <h1>Movie Bucket</h1>

      <div className='search'>
        <input
          placeholder='Search for movies'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <img src={SearchIcon} alt='search' onClick={() => { searchMovies(search); setPage(1) }} />
      </div>

      {
        movies?.length > 0 ? (
          <div className='container'>
            {
              movies.map((movie, index) => (
                <MovieCard key={index} movie={movie} />
              ))
            }
          </div>
        ) : (
          <div className='empty'>
            <h2>No movies found.</h2>
          </div>
        )
      }

      <div className='pagination'>
        <button
          onClick={(prevCount) => page > 1 ? setPage((prevCount) => prevCount - 1, goToPage(page)) : alert('You are in the first page.')}
          disabled={page === 1 ? true : false}>Previous</button>
        <span>{page + ' / ' + totalPages}</span>
        <button
          onClick={(prevCount) => page < totalPages ? setPage((prevCount) => prevCount + 1, goToPage(page)) : alert('No more pages available.')}
          disabled={page === totalPages ? true : false}>Next</button>
      </div>

    </div>
  );
}

export default App;
