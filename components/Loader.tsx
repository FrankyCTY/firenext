import styles from './Loader.module.css';

function Post({ show }) {
  if (!show) return null;

  return <div className={styles.loader}></div>;
}

export default Post;
