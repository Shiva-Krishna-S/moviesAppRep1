import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props

    // const {username} = this.state

    Cookies.set('jwt_token', jwtToken, {expires: 30})

    // localStorage.setItem('userName', username)

    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const loginData = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(loginData.jwt_token)
    } else {
      this.onSubmitFailure(loginData.error_msg)
    }
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  renderPasswordField = () => {
    const {password} = this.state
    return (
      <>
        <label htmlFor="password" className="login-page-input-label">
          PASSWORD
        </label>
        <input
          id="password"
          type="password"
          value={password}
          placeholder="Password"
          onChange={this.onChangePassword}
          className="login-page-input-bar"
          autoComplete="off"
        />
      </>
    )
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  renderUsernameField = () => {
    const {username} = this.state
    return (
      <>
        <label htmlFor="username" className="login-page-input-label">
          USERNAME
        </label>
        <input
          id="username"
          type="text"
          value={username}
          placeholder="Username"
          onChange={this.onChangeUsername}
          className="login-page-input-bar"
        />
      </>
    )
  }

  render() {
    const {showSubmitError, errorMsg} = this.state

    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-page-container">
        <div className="login-page-content-container">
          <img
            src="https://res.cloudinary.com/df8n5yti7/image/upload/v1671029878/Group_7399movies_logo_s93l3x.png"
            alt="login website logo"
            className="login-page-website-logo"
          />
          <div className="login-page-form-container">
            <form onSubmit={this.submitForm} className="login-page-form">
              <h1 className="login-page-form-title">Login</h1>
              {this.renderUsernameField()}
              {this.renderPasswordField()}
              {showSubmitError && (
                <p className="login-error-message">{errorMsg}</p>
              )}
              <button type="submit" className="login-button">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Login
