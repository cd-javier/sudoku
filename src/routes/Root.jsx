import { Outlet, useLocation, NavLink } from 'react-router-dom';
import styles from './Root.module.css';

export default function Root() {
  const location = useLocation();
  const isIndex = location.pathname === '/';

  return (
    <div className={styles.wrapper}>
      <header>
        {!isIndex && (
          <NavLink to="/" className={styles.back}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <title>chevron-left</title>
              <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
            </svg>
          </NavLink>
        )}
        <h1>Sudoku</h1>
        {!isIndex && (
          <NavLink to={location.pathname} className={styles.refresh} reloadDocument>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <title>refresh</title>
              <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z" />
            </svg>
          </NavLink>
        )}
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        Designed and developed by{' '}
        <a
          href="http://www.javierquiroga.com"
          target="_blank"
          rel="noopener noreferrer"
          title="Visit my portfolio"
        >
          Javier Quiroga
        </a>
        <br />
        Check it out on{' '}
        <a
          href="https://github.com/cd-javier/shopping-cart"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </footer>
    </div>
  );
}
