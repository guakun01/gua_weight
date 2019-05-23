import React, { Component } from 'react';
import AV from  'leancloud-storage';
import './App.css';

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      hasAccount: true,
      current_user: {},
      sign_up_form: {
        nickname: '',
        email: '',
        password: '',
        confirm_password: '',
      },
      sign_in_form: {
        email: '',
        password: '',
      }
    }
  }

  componentDidMount() {
    AV.init({
      appId: 'FYCTcKYDOcOsKw2vnRmNvBwQ-gzGzoHsz',
      appKey: 'BVDwbxfu4n7ziAUpuEDnf2z3',
    })
    //
    this.setState({
      current_user: AV.User.current()
    })
  }

  onValueChange (event, field) {
    const val = event.target.value
    let copy = JSON.parse(JSON.stringify(this.state))
    copy.sign_up_form[field] = val
    this.setState(copy)
  }

  onSignInFromValueChange (event, field) {
    const val = event.target.value
    let copy = JSON.parse(JSON.stringify(this.state))
    copy.sign_in_form[field] = val
    this.setState(copy)
  }

  onSubmitSignUpForm () {
    const {nickname, email, password, confirm_password} = this.state.sign_up_form
    if (!email || !password || !confirm_password || !nickname) {
      alert('注册信息不能为空！')
    }
    if (password !== confirm_password) {
      alert('两次密码填写不一致！')
    }
    //
    const user = new AV.User()
    user.setUsername(nickname)
    user.setEmail(email)
    user.setPassword(password)
    user.signUp().then((loginedUser) => {
      console.log('loginedUser')
      console.log(loginedUser)
      this.setState({
        current_user: loginedUser,
        hasAccount: true,
      })
    }, (error) => {
      alert(JSON.stringify(error))
    })
  }

  goSignUp() {
    this.setState({
      hasAccount: false,
    })
  }

  logout() {
    AV.User.logOut()
      .then((response) => {
        console.log('logOut response')
        console.log(response)
        this.setState({
          current_user: null,
        })
      })
  }

  login() {
    const { email, password } = this.state.sign_in_form
    AV.User.loginWithEmail(email, password)
      .then(user => {
        console.log(user)
        this.setState({
          current_user: user,
        })
      }, error => {
        alert(JSON.stringify(error))
      })
  }

  _renderWeightManagementPage() {
    return (
      <div className="container">
        <div className="weight-management-board">
          <button className="middle-button" onClick={() => { this.logout() }}>退出登录</button>
        </div>
      </div>
    )
  }

  _renderSignUpPage () {
    return (
      <div className="container">
        <div className="sign_up">
          <h1>用户注册</h1>
          <p> <input onChange={(e) => { this.onValueChange(e, 'nickname')}} value={this.state.sign_up_form.nickname} className="middle" type="text" placeholder="昵称" /> </p>
          <p> <input onChange={(e) => { this.onValueChange(e, 'email')}} value={this.state.sign_up_form.email} className="middle" type="text" placeholder="Email" /> </p>
          <p> <input onChange={(e) => { this.onValueChange(e, 'password')}} value={this.state.sign_up_form.password} className="middle" type="password" placeholder="密码" /> </p>
          <p> <input onChange={(e) => { this.onValueChange(e, 'confirm_password')}} value={this.state.sign_up_form.confirm_password} className="middle" type="password" placeholder="重复密码" /> </p>
          <p> <input onClick={() => { this.onSubmitSignUpForm() }} className="middle-button" type="submit" value="注册"/> </p>
        </div>
      </div>
    )
  }

  _renderSignInHasAccount () {
    return (
      <div className="container">
        <div className="sign_up">
          <h1>用户登录</h1>
          <p> <input onChange={(e) => { this.onSignInFromValueChange(e, 'email')}} value={this.state.sign_in_form.email} className="middle" type="text" placeholder="Email" /> </p>
          <p> <input onChange={(e) => { this.onSignInFromValueChange(e, 'password')}} value={this.state.sign_in_form.password} className="middle" type="password" placeholder="密码" /> </p>
          <p>
            <input onClick={() => { this.login() }} className="middle-button" type="submit" value="登录"/>
            <a href="javascript:;" onClick={() => { this.goSignUp() }}>去注册 >> </a>
          </p>
        </div>
      </div>
    )
  }

  _renderSignInPage () {
    return (
      <div className='box'>
        { this.state.hasAccount ? this._renderSignInHasAccount() : this._renderSignUpPage() }
      </div>
    )
  }

  render () {
    return (
      <div id="app">
        { this.state.current_user ? this._renderWeightManagementPage() : this._renderSignInPage() }
      </div>
    );
  }
}

export default App;
