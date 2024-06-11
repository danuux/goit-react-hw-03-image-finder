
// import React, { Component } from 'react';
// import Searchbar from './SearchBar/SearchBar';
// import ImageGallery from './ImageGallery/ImageGallery';
// import Loader from './Loader/Loader';
// import Button from './Button/Button';
// import { ToastContainer, toast } from 'react-toastify';

// export default class App extends Component {
//   state = {
//     URL: 'https://pixabay.com/api/',
//     API_KEY: '43589952-9412a2249e6c48e695659638d',
//     pictures: [],
//     error: '',
//     status: 'idle',
//     page: 1,
//     query: '',
//     totalHits: null,
//   };

//   fetchImg = () => {
//     const { URL, API_KEY, query, page } = this.state;
//     fetch(
//       `${URL}?q=${query}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`
//     )
//       .then(res =>
//         res.ok
//           ? res.json()
//           : Promise.reject(new Error('Failed to find any images'))
//       )
//       .then(data => {
//         if (data.total === 0) {
//           toast.error("Didn't find anything");
//         } else {
//           const newPictures = data.hits.map(
//             ({ id, largeImageURL, webformatURL }) => ({
//               id,
//               largeImageURL,
//               webformatURL,
//             })
//           );
//           this.setState(prevState => ({
//             pictures: [...prevState.pictures, ...newPictures],
//             status: 'resolved',
//             totalHits: data.total,
//           }));
//         }
//       })
//       .catch(error =>
//         this.setState({ error: error.message, status: 'rejected' })
//       );
//   };

//   componentDidUpdate(prevProps, prevState) {
//     const { query, page } = this.state;
//     if (query !== prevState.query) {
//       this.setState(
//         { status: 'pending', pictures: [], page: 1 },
//         this.fetchImg
//       );
//     } else if (query === prevState.query && page !== prevState.page) {
//       this.setState({ status: 'pending' }, this.fetchImg);
//     }
//   }

//   processSubmit = query => this.setState({ query });

//   handleLoadMore = () =>
//     this.setState(prevState => ({ page: prevState.page + 1 }));

//   render() {
//     const { pictures, status, totalHits } = this.state;
//     return (
//       <>
//         <Searchbar onSubmit={this.processSubmit} />
//         {pictures.length > 0 && <ImageGallery images={pictures} />}
//         {totalHits > pictures.length && (
//           <Button onClick={this.handleLoadMore} />
//         )}
//         {status === 'pending' && <Loader />}
//         <ToastContainer autoClose={2000} />
//       </>
//     );
//   }
// }
import React, { Component } from 'react';
import ImageGallery from './ImageGallery/ImageGallery';
import Modal from './Modal/Modal';
import Searchbar from './SearchBar/SearchBar';
class App extends Component {
  state = {
    inputValue: '',
    modalImg: '',
    showModal: false,
    page: 1,
  };

  getInputValue = handleValue => {
    this.setState({ inputValue: handleValue, page: 1 });
  };

  toggleModal = () => {
    this.setState(({ showModal }) => ({ showModal: !showModal }));
  };

  getLargeImg = url => {
    this.toggleModal();
    this.setState({ modalImg: url });
  };

  loadMoreBtn = () => {
    this.setState(prevState => ({
      page: prevState.page + 1,
    }));
  };

  render() {
    const { modalImg, showModal, page } = this.state;

    return (
      <>
        <Searchbar getInputValue={this.getInputValue} />
        <ImageGallery
          inputValue={this.state.inputValue}
          onClick={this.getLargeImg}
          loadMoreBtn={this.loadMoreBtn}
          page={page}
        />
        {showModal && <Modal url={modalImg} onClose={this.toggleModal} />}
      </>
    );
  }
}

export default App;
