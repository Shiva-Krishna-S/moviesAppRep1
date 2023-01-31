import './index.css'

const SimilarMovieItem = props => {
  const {similarMovie, getSimilarMovieItemDetails} = props
  const {id, posterPath, title} = similarMovie

  const onClickSimilarMovie = () => {
    getSimilarMovieItemDetails(id)
  }

  return (
    <li className="similar-movie-item">
      <button
        type="button"
        onClick={onClickSimilarMovie}
        className="similar-movie-button"
      >
        <img src={posterPath} alt={title} className="similar-movie-image" />
      </button>
    </li>
  )
}

export default SimilarMovieItem
