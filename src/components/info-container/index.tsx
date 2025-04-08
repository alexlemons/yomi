import { ScrollState } from '../character-container';
import classes from './index.module.css';

type InfoContainerProps = {
  scrollState: ScrollState;
};

export const InfoContainer = ({
  scrollState,
}: InfoContainerProps) => {
  // const showInfo = (scrollState[1] + 1) === scrollState[2];
  const showInfo = !scrollState[3];

  return (
    <div className={classes.root}>
      <div className={classes.actions}>
        {/* TODO: search, filter  */}
        {/* TODO: saved/starred characters */}
        <div>
          {scrollState[3] ? `grade ${scrollState[3]}` : 'About'}
        </div>
      </div>

      <p
        className={[
          classes.about,
          showInfo ? classes.show : '',
        ].join(' ')}
      >
        This site uses <a href="https://www.edrdg.org/wiki/index.php/KANJIDIC_Project" target="_blank">Kanjidic</a> as its source.
        <br/>
        For issues or suggestions please visit <a href="" target="_blank">GitHub</a>.
        <br/>
        For an extensive Japanese dictionary visit <a href="https://jisho.org" target="_blank">Jisho.org</a>.
      </p>
    </div>
  );
}