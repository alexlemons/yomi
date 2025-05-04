import classes from './index.module.css';

export enum ErrorMessage {
  KANJI_FETCH_ERROR = 'Some Kanji failed to load. Please refresh the page.',
}

type ErrorContainerProps = {
  error: ErrorMessage | null;
};

export const ErrorContainer = ({
  error,
}: ErrorContainerProps) => {
  if (!error) return null;

  return (
    <div className={classes.root}>
      {error}
    </div>
  );
}