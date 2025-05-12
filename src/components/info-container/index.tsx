import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { ScrollState } from '../character-container';
import { Link } from '../link';
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
    // Transition grade in/out.
    if (grade && scrollState.grade) {
      clearTimeout(gradeTransitionRef.current);
      setGrade(scrollState.grade);
    } else {
      gradeTransitionRef.current = setTimeout(() => {
        setGrade(scrollState.grade);
      }, 400);
    };

    return () => {
      clearTimeout(gradeTransitionRef.current);
    }
  }, [grade, setGrade, scrollState.grade]);

  const gradeIsTransitioning = grade !== scrollState.grade;

  return (
    <div className={classes.root}>
      <div
        className={classNames(
          classes.grade,
          {[classes.show]: !gradeIsTransitioning}
        )}
      >
        {grade ? `grade ${grade}` : ''}
      </div>
      <p
        className={classNames(
          classes.about,
          {[classes.show]: scrollState.atBottom}
        )}
      >
        This site uses <Link href="https://www.edrdg.org/wiki/index.php/KANJIDIC_Project" text="Kanjidic"/> as its data source.
        <br/>
        For any issues or suggestions please get in touch through <Link href="https://github.com/alexlemons/kanji-explorer" text="GitHub"/>.
        <br/>
        For an extensive Japanese dictionary visit <Link href="https://jisho.org" text="Jisho.org"/>.
      </p>
    </div>
  );
}