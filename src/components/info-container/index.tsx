import { useEffect, useRef, useState } from 'react';
import { ScrollState } from '../character-container';
import classes from './index.module.css';

type InfoContainerProps = {
  scrollState: ScrollState;
};

export const InfoContainer = ({
  scrollState,
}: InfoContainerProps) => {
  const [grade, setGrade] = useState<number | null>(null);
  const gradeTransitionRef = useRef<number>(0);

  useEffect(() => {
    if (grade && scrollState.grade) {
      clearTimeout(gradeTransitionRef.current);
      setGrade(scrollState.grade);
    } else {
      // Transition grade in/out
      gradeTransitionRef.current = setTimeout(() => {
        setGrade(scrollState.grade);
      }, 400);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollState.grade, setGrade]);

  const gradeTransition = grade !== scrollState.grade;

  return (
    <div className={classes.root}>
      <div
        className={[
          classes.grade,
          !gradeTransition ? classes.show : '',
        ].join(' ')}
      >
        {grade ? `grade ${grade}` : ''}
      </div>
      <p
        className={[
          classes.about,
          scrollState.atBottom ? classes.show : '',
        ].join(' ')}
      >
        This site uses <a href="https://www.edrdg.org/wiki/index.php/KANJIDIC_Project" target="_blank">Kanjidic</a> as its source.
        <br/>
        For issues or suggestions please visit the <a href="https://github.com/alexlemons/kanjigen" target="_blank">GitHub</a>.
        <br/>
        For an extensive Japanese dictionary visit <a href="https://jisho.org" target="_blank">Jisho.org</a>.
      </p>
    </div>
  );
}