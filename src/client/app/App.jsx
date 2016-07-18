import React from 'react';
import {render} from 'react-dom';
import GameList from './Games.jsx';

var classNames = require('classnames');

class App extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      data: {
        day: '0',
        month: '0',
        year: '0',
        next_day_date: '',
        modified_date: '',
        game: []
      },
      date: {
        day: '10',
        month: '07',
        year: '2016'
      }
    };
    this.handleChange = this.handleChange.bind(this);
  }
  loadMLBData(year, month, day){
    console.log('loading data');
    $.ajax({
      url: 'http://gd2.mlb.com/components/game/mlb/year_'+year+'/month_'+month+'/day_'+day+'/master_scoreboard.json',
      dataType: 'json',
      cache: false,
      success: function(data){
        this.setState({data: data.data.games});
        console.log(data.data.games);
      }.bind(this),
      error: function(xhr, status, err){
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  }
  handleChange(event) {
    var dateArray = event.target.value.split('-'); // YYYY-MM-DD
    this.setState({
      date: {
        day: dateArray[2],
        month: dateArray[1],
        year: dateArray[0]
      }
    });
    this.loadMLBData(dateArray[0], dateArray[1], dateArray[2]);
  }
  componentDidMount(){
    var today = new Date();
    today = today.toISOString().substring(0, 10); // YYYY-MM-DD
    this.loadMLBData(today.substring(0, 4), today.substring(5, 7), today.substring(8, 10));
  }
  render () {
    var today = new Date();
    today = today.toISOString().substring(0, 10);
    return (
    	<div className="container">
        <h1>
          MLB Game Day 
          <input
            type="date"
            onChange={this.handleChange}
            defaultValue={today}
          />
        </h1>
    		<GameList data={this.state.data.game}/>
    	</div>
	);
  }
}

render(<App/>, document.getElementById('app'));