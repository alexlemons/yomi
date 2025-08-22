import { useContext } from 'react';
import { CharactersContext } from '../../context';
import classes from './index.module.css';

export const ErrorContainer = () => {
  const { error } = useContext(CharactersContext);

  if (!error) return null;
  
  return (
    <div className={classes.root}>
      Error fetching data. Please refresh.
    </div>
  );
}