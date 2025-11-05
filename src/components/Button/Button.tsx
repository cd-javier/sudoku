import styles from './Button.module.css';
import React from 'react';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'number' | 'action';
  disabled?: boolean;
  isNotesMode?: boolean;
  to?: string;
};

export default function Button({
  children,
  onClick,
  type,
  disabled,
  isNotesMode,
  to,
}: ButtonProps) {
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
