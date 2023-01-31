import {Component} from 'react'
import {Link} from 'react-router-dom'
import {MdOutlineNavigateBefore, MdOutlineNavigateNext} from 'react-icons/md'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const moviesPerPage = 16

class Search extends Component {
  state = {
    query: '',
    searchMoviesList: [],
    apiStatus: apiStatusConstants.initial,
    currentPage: 1,
  }

  componentDidMount() {
    this.isComponentMounted = true
  }

  componentWillUnmount() {
    this.isComponentMounted = false
  }

  onClickPrevBtn = () => {
    const {currentPage} = this.state
    if (currentPage > 1) {
      this.setState(prevState => ({currentPage: prevState.currentPage - 1}))
    }
  }

  onClickNextBtn = () => {
    const {currentPage, searchMoviesList} = this.state
    const totalPages = Math.ceil(searchMoviesList.length / moviesPerPage)
    if (currentPage < totalPages) {
      this.setState(prevState => ({currentPage: prevState.currentPage + 1}))
    }
  }

  searchMovies = value => {
    this.setState(
      {query: value, currentPage: 1, searchMoviesList: []},
      this.getSearchResults,
    )
  }

  getSearchResults = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {query} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/movies-app/movies-search?search=${query}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    try {
      const response = await fetch(apiUrl, options)
      //   console.log(response)
      if (response.ok) {
        const data = await response.json()
        const updatedData = data.results.map(eachMovie => ({
          posterPath: eachMovie.poster_path,
          title: eachMovie.title,
          id: eachMovie.id,
          backdropPath: eachMovie.backdrop_path,
        }))
        if (this.isComponentMounted) {
          this.setState({
            searchMoviesList: updatedData,
            apiStatus: apiStatusConstants.success,
          })
        }
      } else {
        const {apiStatus} = this.state
        if (this.isComponentMounted) {
          this.setState({
            apiStatus: apiStatusConstants.failure,
          })
        }
      }
    } catch (error) {
      if (this.isComponentMounted) {
        this.setState({
          apiStatus: apiStatusConstants.failure,
        })
      }
    }
  }

  onTryAgain = () => {
    this.getSearchResults()
  }

  renderSearchFailureView = () => (
    <div className="search-page-failure-view-page-container">
      <img
        src="https://res.cloudinary.com/df8n5yti7/image/upload/v1671028483/Background-CompleteSomething_went_wrong_lpwr8q.png"
        alt="failure view"
        className="failure-view-page-image"
      />
      <h1 className="failure-view-page-msg">
        Something went wrong. Please try again
      </h1>
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

  renderSearchLoadingView = () => (
    <div className="popular-loader-container" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  renderNoMoviesFound = () => {
    const {query} = this.state
    return (
      <div className="no-movies-found-container">
        <img
          src="https://res.cloudinary.com/df8n5yti7/image/upload/v1671028483/Group_7394Search_No_Results_ylyxxy.png"
          alt="no movies"
          className="no-movies-found-image"
        />
        <p className="no-movies-found-msg">
          Your search for {query} did not find any matches.
        </p>
      </div>
    )
  }

  renderSearchSuccessView = () => {
    const {currentPage, query} = this.state
    const {searchMoviesList} = this.state
    const startIndex = (currentPage - 1) * moviesPerPage
    const endIndex = startIndex + moviesPerPage
    const currentPageMoviesList = searchMoviesList.slice(startIndex, endIndex)
    const totalPages = Math.ceil(searchMoviesList.length / moviesPerPage)
    return (
      <div className="search-page-content-container">
        <>
          {searchMoviesList.length > 0 && query !== '' ? (
            <>
              <div className="search-page-content-top-container">
                <ul className="searched-movies-list">
                  {currentPageMoviesList.map(eachMovie => (
                    <li key={eachMovie.id} className="searched-movie-item">
                      <Link to={`/movies/${eachMovie.id}`}>
                        <img
                          src={eachMovie.posterPath}
                          alt={eachMovie.title}
                          className="searched-movie-image"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pagination-container">
                <button
                  type="button"
                  onClick={this.onClickPrevBtn}
                  className="arrow-button"
                >
                  <MdOutlineNavigateBefore className="arrow-icon" />
                </button>
                <p className="page-number-text">
                  {currentPage} of {totalPages}
                </p>
                <button
                  type="button"
                  onClick={this.onClickNextBtn}
                  className="arrow-button"
                >
                  <MdOutlineNavigateNext className="arrow-icon" />
                </button>
              </div>
            </>
          ) : (
            this.renderNoMoviesFound()
          )}
        </>
      </div>
    )
  }

  renderSearchedMovies = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSearchSuccessView()
      case apiStatusConstants.failure:
        return this.renderSearchFailureView()
      case apiStatusConstants.inProgress:
        return this.renderSearchLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="search-page-container">
        <Header searchMovies={this.searchMovies} />
        {this.renderSearchedMovies()}
      </div>
    )
  }
}

export default Search
