import {Component} from 'react'
import Slider from 'react-slick'
import {Link} from 'react-router-dom'

import './index.css'

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
  ],
}

class MoviesSlider extends Component {
  renderSlider = () => {
    const {moviesList} = this.props
    return (
      <Slider {...settings}>
        {moviesList.map(eachMovie => {
          const {id, posterPath, name} = eachMovie
          return (
            <Link to={`/movies/${id}`} key={id}>
              <img className="logo-image" src={posterPath} alt={name} />
            </Link>
          )
        })}
      </Slider>
    )
  }

  render() {
    return (
      <div className="main-container">
        <div className="slick-container">{this.renderSlider()}</div>
      </div>
    )
  }
}

export default MoviesSlider
