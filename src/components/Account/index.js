import Cookies from 'js-cookie'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const Account = props => {
  const onClickLogout = () => {
    const {history} = props

    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  //   const username = localStorage.getItem('userName')

  return (
    <div className="account-background-container">
      <Header />
      <div className="account-details-container">
        <div className="account-details-content-container">
          <h1 className="account-title">Account</h1>
          <hr className="account-separator" />
          <div className="account-sub-container">
            <p className="account-sub-title">Member ship</p>
            <div className="account-sub-title-details-container">
              <p className="account-sub-details-item">username@gmail.com</p>
              <p className="account-sub-details-item password">
                Password : **********
              </p>
            </div>
          </div>
          <hr className="account-separator" />
          <div className="account-sub-container">
            <p className="account-sub-title">Plan details</p>
            <div className="account-sub-title-details-container">
              <div className="account-content-quality-text-container">
                <p className="account-sub-details-item">Premium</p>
                <div className="content-quality-container">
                  <p className="account-sub-details-item content-quality">
                    Ultra HD
                  </p>
                </div>
              </div>
            </div>
          </div>
          <hr className="account-separator" />
          <div className="account-btn-container">
            <button
              type="button"
              className="logout-btn"
              onClick={onClickLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Account
