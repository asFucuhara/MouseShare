import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';

import ReactCursorPosition, { INTERACTIONS } from 'react-cursor-position';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { cursors: {} };
  }

  sendCursorPosition(cursor) {
    if (this.readyToUpdate === true) {
      this.readyToUpdate = false;

      console.log('1234');
      this.socket.emit('cursorChanged', { position: cursor.position });
    } else {
      console.log('123');
    }
  }

  componentDidMount() {
    this.interval = setInterval(() => (this.readyToUpdate = true), 50);
    this.socket = socketIOClient('localhost:5000');
    this.socket.on('update', data => {
      const newCursors = { ...this.state.cursors };
      newCursors[data.id] = data;
      this.setState({ cursors: newCursors });
    });
  }

  renderCursores() {
    const { cursors } = this.state;
    console.log('cursors', cursors);
    const divs = [];
    for (let key in cursors) {
      console.log('key', key);
      if (cursors.hasOwnProperty(key)) {
        divs.push(
          <div
            className="cursor"
            style={{
              height: '5px',
              width: '5px',
              backgroundColor: 'blue',
              position: 'absolute',
              left: `${cursors[key].x}px`,
              top: `${cursors[key].y}px`,
              border: '1px solid'
            }}
          />
        );
      }
    }
    console.log('divs', divs);
    return divs;
  }

  render() {
    return (
      <div className="App">
        {this.renderCursores()}
        <ReactCursorPosition
          onPositionChanged={cursor => this.sendCursorPosition(cursor)}
          activationInteractionMouse={INTERACTIONS.HOVER}
        >
          <div style={{ height: '100vh', width: '100vw', border: '1px solid' }}>
            Well, Hello There!!
          </div>
        </ReactCursorPosition>
      </div>
    );
  }
}

export default App;
