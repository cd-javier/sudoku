import Root from './routes/Root';
import Index from './routes/Index';
import SudokuBoard from './components/Board/SudokuBoard';

const routes = [
  {
    path: '/',
    element: <Root />,
    children: [
      { index: true, element: <Index /> },
      { path: ':mode', element: <SudokuBoard /> },
    ],
  },
];

export default routes;
