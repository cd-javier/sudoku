import Button from '../Button/Button';

import styles from './Keyboard.module.css';

export default function Keyboard({
  handleNumber,
  handleDelete,
  handleUndo,
  handleNotes,
  handleClear,
  isNumberDisabled,
  isUndoDisabled,
  isNotesMode,
}) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className={styles.keyboard}>
      <div className={styles.numbers}>
        {numbers.map((num) => (
          <Button
            type="number"
            key={num}
            onClick={() => handleNumber(num)}
            disabled={isNumberDisabled}
            isNotesMode={isNotesMode}
          >
            {num}
          </Button>
        ))}
        <Button
          type="number"
          onClick={handleDelete}
          disabled={isNumberDisabled}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <title>eraser</title>
            <path d="M16.24,3.56L21.19,8.5C21.97,9.29 21.97,10.55 21.19,11.34L12,20.53C10.44,22.09 7.91,22.09 6.34,20.53L2.81,17C2.03,16.21 2.03,14.95 2.81,14.16L13.41,3.56C14.2,2.78 15.46,2.78 16.24,3.56M4.22,15.58L7.76,19.11C8.54,19.9 9.8,19.9 10.59,19.11L14.12,15.58L9.17,10.63L4.22,15.58Z" />
          </svg>
        </Button>
      </div>
      <div className={styles.actions}>
        <Button type="action" onClick={handleNotes}>
          {isNotesMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <title>pencil-off</title>
              <path d="M18.66,2C18.4,2 18.16,2.09 17.97,2.28L16.13,4.13L19.88,7.88L21.72,6.03C22.11,5.64 22.11,5 21.72,4.63L19.38,2.28C19.18,2.09 18.91,2 18.66,2M3.28,4L2,5.28L8.5,11.75L4,16.25V20H7.75L12.25,15.5L18.72,22L20,20.72L13.5,14.25L9.75,10.5L3.28,4M15.06,5.19L11.03,9.22L14.78,12.97L18.81,8.94L15.06,5.19Z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <title>pencil</title>
              <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
            </svg>
          )}
          <div>Notes</div>
        </Button>
        <Button type="action" onClick={handleUndo} disabled={isUndoDisabled}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <title>arrow-u-left-top</title>
            <path d="M20 13.5C20 17.09 17.09 20 13.5 20H6V18H13.5C16 18 18 16 18 13.5S16 9 13.5 9H7.83L10.91 12.09L9.5 13.5L4 8L9.5 2.5L10.92 3.91L7.83 7H13.5C17.09 7 20 9.91 20 13.5Z" />
          </svg>
          <div>Undo</div>
        </Button>
        <Button type="action" onClick={handleClear}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <title>broom</title>
            <path d="M19.36,2.72L20.78,4.14L15.06,9.85C16.13,11.39 16.28,13.24 15.38,14.44L9.06,8.12C10.26,7.22 12.11,7.37 13.65,8.44L19.36,2.72M5.93,17.57C3.92,15.56 2.69,13.16 2.35,10.92L7.23,8.83L14.67,16.27L12.58,21.15C10.34,20.81 7.94,19.58 5.93,17.57Z" />
          </svg>
          <div>Clear</div>
        </Button>
      </div>
    </div>
  );
}
