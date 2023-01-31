import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Footer from '../Footer'
import Header from '../Header'
import PopularMoviesList from '../PopularMoviesList'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Popular extends Component {
  state = {
    popularMoviesList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getPopularMovies()
    this.isComponentMounted = true
  }

  componentWillUnmount() {
    this.isComponentMounted = false
  }

  getPopularMovies = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/movies-app/popular-movies'
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
        const updatedPopularData = fetchedData.results.map(eachMovie => ({
          backdropPath: eachMovie.backdrop_path,
          id: eachMovie.id,
          overview: eachMovie.overview,
          posterPath: eachMovie.poster_path,
          title: eachMovie.title,
        }))
        if (this.isComponentMounted) {
          this.setState({
            popularMoviesList: updatedPopularData,
            apiStatus: apiStatusConstants.success,
          })
        }
      } else {
        const {apiStatus} = this.state
        if (this.isComponentMounted) {
          this.setState({apiStatus: apiStatusConstants.failure})
        }
      }
    } catch (error) {
      if (this.isComponentMounted) {
        this.setState({apiStatus: apiStatusConstants.failure})
      }
    }
  }

  renderPopularLoadingView = () => (
    <div className="popular-loader-container" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  onTryAgain = () => {
    this.getPopularMovies()
  }

  renderFailureView = () => (
    <div className="popular-failure-view-page-container">
      <img
        src="https://res.cloudinary.com/df8n5yti7/image/upload/v1671028483/Background-CompleteSomething_went_wrong_lpwr8q.png"
        alt="failure view"
        className="failure-view-page-image"
      />
      <p className="failure-view-page-msg">
        Something went wrong. Please try again
      </p>
      <div className="failure-view-page-try-again-btn-container">
        <button
          type="button"
          onClick={this.onTryAgain}
          className="failure-view-page-try-again-btn"
        >
          Try Again
        </button>
      </div>
    </div>
  )

  renderPopularMoviesList = () => {
    const {popularMoviesList} = this.state

    return (
      <>
        <PopularMoviesList popularMoviesList={popularMoviesList} />
      </>
    )
  }

  renderPopularMovies = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderPopularMoviesList()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderPopularLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="popular-page-background-container">
        <Header />
        {this.renderPopularMovies()}
        <Footer />
      </div>
    )
  }
}

export default Popular
