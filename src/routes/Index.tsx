import Button from '../components/Button/Button';
import styles from './Index.module.css';

export default function Index() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.subheader}>Select game mode:</div>
      <div className={styles.actions}>
        <Button to="/blank">Blank</Button>
        <Button to="/easy">Easy</Button>
        <Button to="/medium">Medium</Button>
        <Button to="/hard">Hard</Button>
      </div>
    </div>
  );
}
