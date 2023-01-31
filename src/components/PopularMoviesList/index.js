import {Component} from 'react'
import {Link} from 'react-router-dom'
import {MdOutlineNavigateBefore, MdOutlineNavigateNext} from 'react-icons/md'
import './index.css'

const moviesPerPage = 16

class PopularMoviesList extends Component {
  state = {currentPage: 1}

  onClickPrevBtn = () => {
    const {currentPage} = this.state
    if (currentPage > 1) {
      this.setState(prevState => ({currentPage: prevState.currentPage - 1}))
    }
  }

  onClickNextBtn = () => {
    const {popularMoviesList} = this.props
    const {currentPage} = this.state
    const totalPages = Math.ceil(popularMoviesList.length / moviesPerPage)
    if (currentPage < totalPages) {
      this.setState(prevState => ({currentPage: prevState.currentPage + 1}))
    }
  }

  render() {
    const {popularMoviesList} = this.props
    const {currentPage} = this.state
    const startIndex = (currentPage - 1) * moviesPerPage
    const endIndex = startIndex + moviesPerPage
    const currentPageMoviesList = popularMoviesList.slice(startIndex, endIndex)
    const totalPages = Math.ceil(popularMoviesList.length / moviesPerPage)

    return (
      <div className="popular-movies-content-container">
        <div className="popular-movies-content-top-container">
          <ul className="popular-movies-list-container">
            {currentPageMoviesList.map(eachMovie => (
              <li className="popular-movie-item" key={eachMovie.id}>
                <Link to={`/movies/${eachMovie.id}`}>
                  <img
                    src={eachMovie.posterPath}
                    alt={eachMovie.title}
                    className="popular-movie-image"
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
      </div>
    )
  }
}

export default PopularMoviesList
