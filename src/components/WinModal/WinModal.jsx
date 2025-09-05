import confetti from 'canvas-confetti';
import { useEffect } from 'react';

import styles from './WinModal.module.css';

import Button from '../Button/Button';

export default function WinModal({ mode }) {
  useEffect(() => {
    confetti({
      particleCount: 400,
      spread: 180,
      //   origin: { y: 0.6 },
      colors: ['#3a8cf8'],
    });
  }, []);

  return (
    <div className={styles.modal}>
      <div className={styles.heading}>Congratulations!</div>
      <div>You've completed this {mode} sudoku!</div>
      <div>Do you want to play another one?</div>
      <Button to="/">Restart</Button>
    </div>
  );
}
