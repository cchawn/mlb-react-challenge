import React from 'react';

var classNames = require('classnames');

class GameList extends React.Component {
	render(){
    if (this.props.data == undefined){
      var gameData = (
        <p>No games today!</p>
      );
    }
    else if (!Array.isArray(this.props.data)){
      var gameData = (
        <Game game={this.props.data} key={0}/>
      );
    }else{
      var gameData = this.props.data.map(function(game){
        return (
          <Game game={game} key={game.id}/>
        );
      });
    }
    return (
      <div className="gameList">
        {gameData}
      </div>
    )
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      showDetails: false,
      details: {}
    }

    this.showGameDetails = this.showGameDetails.bind(this);
    this.hideGameDetails = this.hideGameDetails.bind(this);
  }
  showGameDetails(){
    var game_data_directory = this.props.game.game_data_directory;
    if (game_data_directory != undefined){
      var url = 'http://gd2.mlb.com' + game_data_directory + '/boxscore.json';
      $.ajax({
        url: url,
        dataType: 'json',
        cache: false,
        success: function(data){
          console.log(data);
          this.setState({ 
            showDetails: true,
            details: data.data 
          });
        }.bind(this),
        error: function(xhr, status, err){
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    }
  }
  hideGameDetails(){
    this.setState({ showDetails: false });
  }

  render(){
    var homeScore = '-';
    var awayScore = '-';
    var homeWinClass = classNames({ 'team-name': true });
    var awayWinClass = classNames({ 'team-name': true });
    if (this.props.game.linescore != undefined){
      homeWinClass = classNames({
        'win': Number(this.props.game.linescore.r.home) > Number(this.props.game.linescore.r.away),
        'team-name': true
      });
      awayWinClass = classNames({
        'win': Number(this.props.game.linescore.r.home) < Number(this.props.game.linescore.r.away),
        'team-name': true
      });
      homeScore = this.props.game.linescore.r.home;
      awayScore = this.props.game.linescore.r.away;
    }
    return (
      <div className="game row">
        <div className="col-xs-12">
          <table>
            <tbody>
              <tr>
                <td className={homeWinClass}>
                  {this.props.game.home_team_name}
                </td>
                <td className="score">
                  {homeScore}
                </td>
                <td rowSpan="2">
                  {this.props.game.status.status}
                </td>
                <td rowSpan="2">
                  { !this.state.showDetails ? <button className="btn btn-primary" onClick={this.showGameDetails} disabled={this.props.game.status.status == 'Preview'}><i className="fa fa-eye"></i></button> : null }
                  { this.state.showDetails ? <button className="btn btn-primary" onClick={this.hideGameDetails}><i className="fa fa-eye-slash"></i></button> : null }
                </td>
              </tr>
              <tr>
                <td className={awayWinClass}>
                  {this.props.game.away_team_name}
                </td>
                <td className="score">
                  {awayScore}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        { this.state.showDetails ? <GameDetails data={this.state.details}/> : null }
      </div>
    );
  }
}

class GameDetails extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    console.log(this.props.data);
    return (
      <div className="col-xs-12 game-details">
        <table>
          <tbody>
            <tr>
              <td>Inning</td>
              <td>1</td>
              <td>2</td>
              <td>3</td>
              <td>4</td>
              <td>5</td>
              <td>6</td>
              <td>7</td>
              <td>8</td>
              <td>9</td>
            </tr>
            <tr>
              <td>Home</td>
              <td>{this.props.data.boxscore.linescore.inning_line_score[0].home}</td>
              <td>{this.props.data.boxscore.linescore.inning_line_score[1].home}</td>
              <td>{this.props.data.boxscore.linescore.inning_line_score[2].home}</td>
              <td>{this.props.data.boxscore.linescore.inning_line_score[3].home}</td>
              <td>{this.props.data.boxscore.linescore.inning_line_score[4].home}</td>
              <td>{this.props.data.boxscore.linescore.inning_line_score[5].home}</td>
              <td>{this.props.data.boxscore.linescore.inning_line_score[6].home}</td>
              <td>{this.props.data.boxscore.linescore.inning_line_score[7].home}</td>
              <td>{this.props.data.boxscore.linescore.inning_line_score[8].home}</td>
            </tr>
            <tr>
              <td>Away</td>
              <td>{this.props.data.boxscore.linescore.inning_line_score[0].away}</td>
              <td>{this.props.data.boxscore.linescore.inning_line_score[1].away}</td>
              <td>{this.props.data.boxscore.linescore.inning_line_score[2].away}</td>
              <td>{this.props.data.boxscore.linescore.inning_line_score[3].away}</td>
              <td>{this.props.data.boxscore.linescore.inning_line_score[4].away}</td>
              <td>{this.props.data.boxscore.linescore.inning_line_score[5].away}</td>
              <td>{this.props.data.boxscore.linescore.inning_line_score[6].away}</td>
              <td>{this.props.data.boxscore.linescore.inning_line_score[7].away}</td>
              <td>{this.props.data.boxscore.linescore.inning_line_score[8].away}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default GameList;