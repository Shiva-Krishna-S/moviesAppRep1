import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import MoviesSlider from '../MoviesSlider'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class TopRatedMovies extends Component {
  state = {
    topRatedMoviesList: [],
    topRatedMoviesApiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getTopRatedMovies()
    this.isComponentMounted = true
  }

  componentWillUnmount() {
    this.isComponentMounted = false
  }

  getTopRatedMovies = async () => {
    this.setState({topRatedMoviesApiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/movies-app/top-rated-movies'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    try {
      const response = await fetch(apiUrl, options)
      if (response.ok) {
        const fetchedData = await response.json()
        const updatedTopRatedData = fetchedData.results.map(eachMovie => ({
          backdropPath: eachMovie.backdrop_path,
          id: eachMovie.id,
          overview: eachMovie.overview,
          posterPath: eachMovie.poster_path,
          name: eachMovie.title,
        }))
        if (this.isComponentMounted) {
          this.setState({
            topRatedMoviesList: updatedTopRatedData,
            topRatedMoviesApiStatus: apiStatusConstants.success,
          })
        }
      } else {
        const {topRatedMoviesApiStatus} = this.state
        if (this.isComponentMounted) {
          this.setState({topRatedMoviesApiStatus: apiStatusConstants.failure})
        }
      }
    } catch (error) {
      if (this.isComponentMounted) {
        this.setState({topRatedMoviesApiStatus: apiStatusConstants.failure})
      }
    }
  }

  renderMoviesCategoryLoadingView = () => (
    <div className="movie-category-failure-view" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={20} width={20} />
    </div>
  )

  onTopRatedMoviesTryAgain = () => {
    this.getTopRatedMovies()
  }

  renderTopRatedMoviesFailureView = () => (
    <div className="movie-category-failure-view">
      <img
        src="https://res.cloudinary.com/df8n5yti7/image/upload/v1671379818/alert-trianglefailure_view_bdhscp.png"
        alt="failure view"
        className="movie-category-failure-image"
      />
      <p className="movie-category-failure-message">
        Something went wrong. Please try again
      </p>
      <button
        type="button"
        onClick={this.onTopRatedMoviesTryAgain}
        className="failure-retry-button"
      >
        Try Again
      </button>
    </div>
  )

  renderTopRatedMoviesListView = () => {
    const {topRatedMoviesList} = this.state

    return <MoviesSlider moviesList={topRatedMoviesList} />
  }

  renderTopRatedMovies = () => {
    const {topRatedMoviesApiStatus} = this.state

    switch (topRatedMoviesApiStatus) {
      case apiStatusConstants.success:
        return this.renderTopRatedMoviesListView()
      case apiStatusConstants.failure:
        return this.renderTopRatedMoviesFailureView()
      case apiStatusConstants.inProgress:
        return this.renderMoviesCategoryLoadingView()
      default:
        return null
    }
  }

  render() {
    return <>{this.renderTopRatedMovies()}</>
  }
}

export default TopRatedMovies
