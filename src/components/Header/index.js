import {Component} from 'react'
import {HiOutlineSearch} from 'react-icons/hi'
import {MdOutlineMenuOpen} from 'react-icons/md'
import {AiFillCloseCircle} from 'react-icons/ai'
import {Link, withRouter} from 'react-router-dom'
import './index.css'

class Header extends Component {
  state = {
    searchInput: '',
    searchPath: '',
    showMenuTabs: false,
  }

  componentDidMount() {
    const {location} = this.props
    const {pathname} = location
    this.setState({searchPath: pathname})
  }

  onClickMenuBar = () => {
    this.setState({showMenuTabs: true})
  }

  onClickCloseIcon = () => {
    this.setState({showMenuTabs: false})
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearchIcon = () => {
    const {searchPath} = this.state

    const {history} = this.props

    if (searchPath !== '/search') {
      history.push('/search')
    } else {
      const {searchInput} = this.state
      const {searchMovies} = this.props

      searchMovies(searchInput)
    }
  }

  onSearchEnter = event => {
    const {searchInput} = this.state
    const {searchMovies} = this.props
    if (event.key === 'Enter') {
      searchMovies(searchInput)
    }
  }

  render() {
    const {searchPath, showMenuTabs, searchInput} = this.state

    const showSearchInput = searchPath === '/search'

    const homeTabClassName = searchPath === '/' ? 'active' : null
    const popularTabClassName = searchPath === '/popular' ? 'active' : null
    const accountTabClassName = searchPath === '/account' ? 'active' : null

    return (
      <nav className="navbar-container">
        <div className="navbar-sub-container">
          <div className="navbar-main-container">
            <div className="navbar-main-container-img-tabs">
              <Link to="/">
                <img
                  src="https://res.cloudinary.com/df8n5yti7/image/upload/v1671029878/Group_7399movies_logo_s93l3x.png"
                  alt="website logo"
                  className="header-website-logo"
                />
              </Link>
              <ul className="navbar-main-container-tabs-container">
                <li className={`navbar-main-container-tab ${homeTabClassName}`}>
                  <Link to="/" className="navbar-link">
                    Home
                  </Link>
                </li>

                <li
                  className={`navbar-main-container-tab ${popularTabClassName}`}
                >
                  <Link to="/popular" className="navbar-link">
                    Popular
                  </Link>
                </li>
              </ul>
            </div>
            <div className="header-search-menu-icons-container">
              {showSearchInput && (
                <div className="search-input-container">
                  <input
                    type="search"
                    value={searchInput}
                    placeholder="Search"
                    onChange={this.onChangeSearchInput}
                    onKeyDown={this.onSearchEnter}
                    className="search-input-bar"
                  />
                  <button
                    type="button"
                    className="search-page-search-icon-btn"
                    onClick={this.onClickSearchIcon}
                    testid="searchButton"
                  >
                    <HiOutlineSearch className="search-page-go-search-icon" />
                  </button>
                </div>
              )}
              {!showSearchInput && (
                <button
                  type="button"
                  className="header-search-menu-icons-button"
                  onClick={this.onClickSearchIcon}
                  testid="searchButton"
                >
                  <HiOutlineSearch className="go-search-icon" />
                </button>
              )}
              <button
                type="button"
                className="header-menu-icon-button"
                onClick={this.onClickMenuBar}
              >
                <MdOutlineMenuOpen className="menu-open-icon" />
              </button>
              <div className="header-profile-icon-container">
                <Link to="/account">
                  <img
                    src="https://res.cloudinary.com/df8n5yti7/image/upload/v1671028482/Avatarmale_avatar_1_dnfdgg.png"
                    alt="profile"
                    className="profile-image"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="navbar-sub-container">
          {showMenuTabs && (
            <div className="navbar-route-tabs-container">
              <ul className="navbar-route-list-container">
                <li
                  className={`navbar-route-list-tab-name ${homeTabClassName}`}
                >
                  <Link to="/" className="navbar-link">
                    Home
                  </Link>
                </li>
                <li
                  className={`navbar-route-list-tab-name ${popularTabClassName}`}
                >
                  <Link to="/popular" className="navbar-link">
                    Popular
                  </Link>
                </li>
                <li
                  className={`navbar-route-list-tab-name ${accountTabClassName}`}
                >
                  <Link to="/account" className="navbar-link">
                    Account
                  </Link>
                </li>
              </ul>
              <button
                type="button"
                className="navbar-close-icon-button"
                onClick={this.onClickCloseIcon}
              >
                <AiFillCloseCircle className="navbar-close-icon" />
              </button>
            </div>
          )}
        </div>
      </nav>
    )
  }
}

export default withRouter(Header)
