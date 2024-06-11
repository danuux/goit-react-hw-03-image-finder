import React, { Component } from 'react';
import styles from './ImageGallery.module.css';
import ImageGalleryItem from 'components/ImageGalleryItem/ImageGalleryItem';
import PropTypes from 'prop-types';
import getImages from '../Api/Api';
import Loader from '../Loader/Loader';
import Button from '../Button/Button';

// export default class ImageGallery extends Component {
//   state = {
//     showModal: false,
//     bigPic: null,
//   };

//   componentDidMount() {
//     document.addEventListener('click', e => {
//       if (e.target.nodeName !== 'IMG') {
//         this.setState({ showModal: false });
//         return;
//       } else {
//         let picture = this.props.images.filter(obj => {
//           return obj.id === parseInt(e.target.alt);
//         });
//         this.setState({ bigPic: picture[0].largeImageURL });
//       }
//     });
//   }

//   toggleModal = () => {
//     this.setState(({ showModal }) => ({ showModal: !showModal }));
//   };

//   render() {
//     const { showModal, bigPic } = this.state;
//     return (
//       <>
//         <ul className={s.gallery} onClick={this.toggleModal}>
//           {this.props.images.map(img => {
//             return (
//               <ImageGalleryItem
//                 key={nanoid()}
//                 smallImgURL={img.webformatURL}
//                 id={img.id}
//               />
//             );
//           })}
//         </ul>
//         {showModal && bigPic && (
//           <Modal onClose={this.toggleModal} pic={bigPic} />
//         )}
//       </>
//     );
//   }
// }

// ImageGallery.propTypes = {
//   images: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.number.isRequired,
//       largeImageURL: PropTypes.string.isRequired,
//       webformatURL: PropTypes.string.isRequired,
//     })
//   ),
// };

export default class ImageGallery extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    inputValue: PropTypes.string.isRequired,
  };

  state = {
    images: [],
    status: 'idle',
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.inputValue !== this.props.inputValue) {
      this.fetchLoad();
    }
    if (prevProps.page !== this.props.page && this.props.page > 1) {
      this.fetchLoadMore();
    }
  }

  fetchLoad = () => {
    const { inputValue, page } = this.props;

    getImages(inputValue, page)
      .then(response => {
        this.setState({
          images: response.hits,
          status: 'resolve',
        });
      })
      .catch(error => this.setState({ status: 'rejected' }));
  };

  fetchLoadMore = () => {
    const { inputValue, page } = this.props;

    getImages(inputValue, page)
      .then(response => {
        this.setState(prevState => ({
          images: [...prevState.images, ...response.hits],
          status: 'resolve',
        }));
      })
      .catch(error => this.setState({ status: 'rejected' }));
  };

  render() {
    const { images, status } = this.state;

    if (status === 'pending') {
      return <Loader />;
    }

    if (status === 'resolve') {
      return (
        <>
          <ul className={styles.gallery}>
            {images.map(({ id, largeImageURL, tags }) => (
              <ImageGalleryItem
                key={id}
                url={largeImageURL}
                tags={tags}
                onClick={this.props.onClick}
              />
            ))}
          </ul>
          {this.state.images.length !== 0 ? (
            <Button onClick={this.props.loadMoreBtn} />
          ) : (
            alert('No results')
          )}
        </>
      );
    }
  }
}
