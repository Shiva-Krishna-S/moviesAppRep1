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

class TrendingMovies extends Component {
  state = {
    trendingMoviesList: [],
    trendingMoviesApiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getTrendingMovies()
    this.isComponentMounted = true
  }

  componentWillUnmount() {
    this.isComponentMounted = false
  }

  getTrendingMovies = async () => {
    this.setState({trendingMoviesApiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/movies-app/trending-movies'
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
        const updatedTrendingData = fetchedData.results.map(eachMovie => ({
          backdropPath: eachMovie.backdrop_path,
          id: eachMovie.id,
          overview: eachMovie.overview,
          posterPath: eachMovie.poster_path,
          name: eachMovie.title,
        }))
        if (this.isComponentMounted) {
          this.setState({
            trendingMoviesList: updatedTrendingData,
            trendingMoviesApiStatus: apiStatusConstants.success,
          })
        }
      } else {
        const {trendingMoviesApiStatus} = this.state
        if (this.isComponentMounted) {
          this.setState({trendingMoviesApiStatus: apiStatusConstants.failure})
        }
      }
    } catch (error) {
      if (this.isComponentMounted) {
        this.setState({trendingMoviesApiStatus: apiStatusConstants.failure})
      }
    }
  }

  renderMoviesCategoryLoadingView = () => (
    <div className="movie-category-failure-view" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={20} width={20} />
    </div>
  )

  onTrendingTryAgain = () => {
    this.getTrendingMovies()
  }

  renderTrendingFailureView = () => (
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
        onClick={this.onTrendingTryAgain}
        className="failure-retry-button"
      >
        Try Again
      </button>
    </div>
  )

  renderTrendingMoviesListView = () => {
    const {trendingMoviesList} = this.state

    return <MoviesSlider moviesList={trendingMoviesList} />
  }

  renderTrendingMovies = () => {
    const {trendingMoviesApiStatus} = this.state

    switch (trendingMoviesApiStatus) {
      case apiStatusConstants.success:
        return this.renderTrendingMoviesListView()
      case apiStatusConstants.failure:
        return this.renderTrendingFailureView()
      case apiStatusConstants.inProgress:
        return this.renderMoviesCategoryLoadingView()
      default:
        return null
    }
  }

  render() {
    return <>{this.renderTrendingMovies()}</>
  }
}

export default TrendingMovies
