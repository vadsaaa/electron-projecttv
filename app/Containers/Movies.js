import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { moviesFetch, trailerFetch } from '../Actions/MoviesActions';
import Poster from '../Components/Poster';
import MovieDetails from '../Components/MovieDetails';
import YoutubeComponent from '../Components/YoutubeComponent';
// Styles
import styles from './Styles/MoviesStyle';

let page = 1;

class Movies extends Component {
  constructor(props) {
    super(props);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      choice:'sort_by=popularity.desc',
      page: 1,
      selectedValue: 'Most Popular',
      show: false
    };

    this.props.moviesFetch(this.state.choice, this.state.page);
    this.loadMoreItems();
    this.handleScroll = this.handleScroll.bind(this);
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow(movie) {
    this.setState({ show: true, movie });
    this.props.trailerFetch(movie.title);
  }

  handleScroll() {
    const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
    const windowBottom = windowHeight + window.pageYOffset;
    if (windowBottom >= docHeight) {
      this.loadMoreItems();
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    if(this.props.location.state) {
      const elmnt = document.getElementById(`${this.props.location.state.index}`);
      elmnt.scrollIntoView();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  loadMoreItems() {
    page++;
    this.props.moviesFetch(this.state.choice, page);
  }

  renderModal() {
    return (
      <Modal
        show={this.state.show}
        onHide={this.handleClose}
        style={{display: 'flex', flexDirection: 'row', backgrondColor: 'rgb(32, 32, 32)'}}
      >
        <div
          style={{display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}
        >
          {/* { this.props.trailerId ? <MovieDetails movie={this.state.movie} /> : null } */}
          { this.props.trailerId ? <YoutubeComponent trailerId={this.props.trailerId} />: null }
        </div>
      </Modal>
    );
  }

  render() {
    return (
      <div
        id="container"
        style={styles.container}
      >
        {this.renderModal()}
        <div style={styles.listContent}>
          {
            this.props.movies.map((movie, index) => {
              return (
                <Poster
                  key={index}
                  movie={movie}
                  onClick={() => this.handleShow(movie) }
                />
              );
            })
          }
          <div className="fixedDiv" style={{ display: 'flex', flex: 1 }} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const movies = state.movies.data;
  const trailerId = state.movies.trailerId;
  return { movies, trailerId };
};

const mapDispatchToProps = (dispatch) => {
  return {
    moviesFetch: (choice, page) => {
      dispatch(moviesFetch(choice, page));
    },
    trailerFetch: movie => {
      dispatch(trailerFetch(movie));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Movies);
