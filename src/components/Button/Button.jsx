import styles from './Button.module.css';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';

export default function Button({
  children,
  onClick,
  type,
  disabled,
  isNotesMode,
  to,
}) {
  if (to)
    return (
      <NavLink to={to} className={styles.button}>
        {children}
      </NavLink>
    );
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(styles.button, {
        [styles.disabled]: disabled,
        [styles.number]: type === 'number',
        [styles.action]: type === 'action',
        [styles.notesNumber]: isNotesMode,
      })}
    >
      {children}
    </button>
  );
}
