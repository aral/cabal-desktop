import React from 'react'
import { clipboard } from 'electron'
import { connect } from 'react-redux'

import { viewChannel, joinChannel, changeUsername, changeScreen } from '../actions'
import InputPrompt from './InputPrompt'

const mapStateToProps = state => {
  var cabal = state.cabals[state.currentCabal]
  return {
    addr: state.currentCabal,
    cabals: state.cabals,
    cabal,
    username: cabal.username
  }
}

const mapDispatchToProps = dispatch => ({
  changeScreen: ({screen}) => dispatch(changeScreen({screen})),
  joinChannel: ({addr, channel}) => dispatch(joinChannel({addr, channel})),
  viewChannel: ({addr, channel}) => dispatch(viewChannel({addr, channel})),
  changeUsername: ({addr, username}) => dispatch(changeUsername({addr, username}))
})

class SidebarScreen extends React.Component {
  joinChannel (channel) {
    var addr = this.props.addr
    this.props.joinChannel({addr, channel})
  }

  copyClick () {
    clipboard.writeText('dat://' + this.props.addr)
    alert('Copied dat:// link to clipboard! Now give it to people you want to join your Cabal. Only people with the link can join.')
  }

  selectCabal (addr) {

  }

  selectChannel (channel) {
    var addr = this.props.addr
    this.props.viewChannel({addr, channel})
  }

  render () {
    var self = this
    const { addCabal, addr, cabals, cabal, username } = this.props

    var userKeys = Object.keys(cabal.users)
    var channelKeys = Object.keys(cabal.channels)
    var cabalKeys = Object.keys(cabals)

    return (<div className='sidebar'>
      <div className=''>
        <div className=''>
        <div className='add-channel'>
          <button onClick={addCabal}> Add Cabal</button>
        </div>
          <div className='heading'>Cabals</div>
          {cabalKeys.map(function (addr) {
            var cabal = cabals[addr]
            return (
              <li className={addr === cabal.addr ? 'active': '' } key={addr}>
                <button onClick={self.selectCabal.bind(self, addr)}>
                  {cabal.addr}
                </button>
              </li>
            )
          })}
        </div>
      </div>
      <div className='copy-link'>
        <button onClick={self.copyClick.bind(self)}>Copy Dat Link</button>
      </div>
      <div className='add-channel'>
        <InputPrompt
          placeholder='Channel name'
          prompt='+ Join Channel'
          onSubmit={self.joinChannel.bind(self)} />
      </div>
      <div className='sidebar-scroll'>
        <div className='channels'>
          <div className='heading'>Channels</div>
          <ul>
            {
              channelKeys.map((channel) =>
                <li className={cabal.channel === channel ? 'active' : ''} key={channel}>
                  <button onClick={this.selectChannel.bind(this, channel)}>
                    {channel}
                  </button>
                </li>
              )
            }
          </ul>
        </div>
        <div className='users'>
          <div className='heading'>Users</div>
          <ul className='users-list'>
            {userKeys.map((_username) =>
              (_username !== username) && <li> {_username}</li>
            )}
          </ul>
          <ul className='status'>
            <InputPrompt
              placeholder='Enter name'
              prompt={cabal.username}
              onSubmit={username => this.props.changeUsername({ username, addr: this.props.addr })}
            />
          </ul>
        </div>
      </div>
    </div>
    )
  }
}

const Sidebar = connect(mapStateToProps, mapDispatchToProps)(SidebarScreen)

export default Sidebar
